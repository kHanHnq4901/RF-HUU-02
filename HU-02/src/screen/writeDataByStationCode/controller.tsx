import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { PropsKHCMISModel } from '../../database/model';
import { CMISKHServices } from '../../database/service';
import {
  PropsRouteParamsWriteColumn,
  StackWriteStationCodeNavigationProp,
} from '../../navigation/model/model';
import {
  getLabelAndIsManyPriceBy3Character,
  TYPE_READ_RF,
} from '../../service/hhu/defineEM';
import { PropsStore, storeContext } from '../../store';
import { sizeScreen } from '../../theme';

type PropsCheckBox = {
  checked: boolean;
  label: 'Chưa đọc' | 'Đọc lỗi' | 'Ghi tay' | 'Bất thường';
  // value: 'Chưa đọc' | 'Đọc lỗi' | 'Ghi tay' | 'Bất thường';
};

const itemPerRender = 10;

export const variable = {
  modalAlert: {
    title: '',
    content: '',
    onDissmiss: (value?: any) => {},
    onOKPress: () => {},
  },
};

export type PropsDatatable = {
  id: string;
  show: boolean;
  stt: string;
  checked: boolean;
  data: PropsKHCMISModel;
  isManyPrice: boolean;
  labelMeter: string;
};

export type HookState = {
  arrColumnColumnCode: string[];
  //dataDB: PropsKHCMISModel[];
  isReading: boolean;
  requestStop: boolean;
  selectAll: boolean;
  arrCheckBoxRead: PropsCheckBox[];
  status: string;
  dataTable: PropsTable;
  totalBCS: string;
  totalSucceed: string;
  selectedColumn: string | null;
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

export type PropsTable = {
  render: PropsDatatable[];
  noRender: PropsDatatable[];
};

const TAG = ' Controller: ';

export const hookProps = {} as HookProps;
export let store = {} as PropsStore;
export let navigation: StackWriteStationCodeNavigationProp;

export function isCloseToBottom({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent): boolean {
  const paddingToBottom = sizeScreen.height * 3;

  const result: boolean =
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;

  //console.log('contentOffset:', contentOffset);

  // if (result) {
  //   console.log('layoutMeasurement:', layoutMeasurement);
  //   console.log('contentSize:', contentSize);
  // }
  return result;
}

export function onScrollToEnd() {
  if (hookProps.state.dataTable.noRender.length > 0) {
    hookProps.setState(state => {
      state.dataTable = addMoreItemToRender(state.dataTable);
      return { ...state };
    });
  }
}

export function addMoreItemToRender(dataTable: PropsTable): PropsTable {
  let numAddItem = 0;
  while (true) {
    const item = dataTable.noRender.shift();
    if (item) {
      dataTable.render.push(item);
      if (item.show === true) {
        numAddItem++;
      }
    } else {
      break;
    }

    if (numAddItem >= itemPerRender) {
      break;
    }
  }
  return { ...dataTable };
}

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>({
    arrColumnColumnCode: [],
    //dataDB: [],
    isReading: false,
    selectAll: false,
    arrCheckBoxRead: [
      {
        label: 'Chưa đọc',
        //value: 'Chưa đọc',
        checked: false,
      },
      {
        label: 'Đọc lỗi',
        //value: 'Đọc lỗi',
        checked: false,
      },
      {
        label: 'Ghi tay',
        //value: 'Ghi tay',
        checked: false,
      },
      {
        label: 'Bất thường',
        //value: 'Bất thường',
        checked: false,
      },
    ],
    status: '',
    dataTable: {
      render: [],
      noRender: [],
    },
    totalBCS: '0',
    totalSucceed: '0',
    selectedColumn: null,
    requestStop: false,
  });
  hookProps.state = state;
  hookProps.setState = setState;
  store = React.useContext(storeContext) as PropsStore;
  navigation = useNavigation<StackWriteStationCodeNavigationProp>();
  return hookProps;
};

const getDataDb = async (ref, routeParams: PropsRouteParamsWriteColumn) => {
  let items: PropsKHCMISModel[];
  let dataDB: PropsKHCMISModel[] = [];
  let columnCodeSet = new Set<string>();
  //let totalMeterDBSet = new Set<string>();
  let arrColumnCode: string[] = [];
  let dataTable: PropsTable = {
    render: [],
    noRender: [],
  };
  let totalBCS = 0;
  let totalSucceed = 0;
  let firstTime = hookProps.state.dataTable.render.length === 0 ? true : false;
  //let stt = 1;

  hookProps.setState(state => {
    state.status = 'Đang cập nhật dữ liệu ...';

    return { ...state };
  });

  //console.log(TAG, 'routeParams', routeParams);
  try {
    //if (store.state.appSetting.showResultOKInWriteData === true) {
    items = await CMISKHServices.findAll();
    dataDB = items;
    for (let item of dataDB) {
      if (item.MA_TRAM === routeParams.stationCode) {
        let ok = false;
        if (routeParams.columnCode.length > 0) {
          if (routeParams.columnCode.includes(item.MA_COT)) {
            ok = true;
          }
        } else {
          ok = true;
        }
        if (ok) {
          columnCodeSet.add(item.MA_COT);
          //totalMeterDBSet.add(item.SERY_CTO);
          totalBCS++;
          if (
            item.LoaiDoc === TYPE_READ_RF.READ_SUCCEED ||
            item.LoaiDoc === TYPE_READ_RF.WRITE_BY_HAND
          ) {
            totalSucceed++;
          }

          const labelAndIsManyPrice = getLabelAndIsManyPriceBy3Character(
            item.MA_CTO.substring(0, 3),
          );
          dataTable.noRender.push({
            checked: false,
            data: item,
            id: item.id,
            show: true,
            stt: item.TT.toString(),
            isManyPrice: labelAndIsManyPrice.isManyPrice,
            labelMeter: labelAndIsManyPrice.label,
          });
        }
        //console.log('item:', item);
      }
    }

    arrColumnCode = Array.from(columnCodeSet).sort();
    arrColumnCode.unshift('Tất cả');

    dataTable = addMoreItemToRender(dataTable);

    console.log(
      'dataTable:',
      dataTable.render.length + dataTable.noRender.length,
    ); //console.log('arrStationCode:', arrStationCode);
    hookProps.setState(state => {
      //state.dataDB = dataDB;
      state.arrColumnColumnCode = arrColumnCode;
      state.totalBCS = totalBCS.toString();
      state.totalSucceed = totalSucceed.toString();
      state.dataTable = dataTable;
      state.status = '';
      return { ...state };
    });
    if (firstTime) {
      ref?.current?.openDropdown();
    }

    //}
  } catch (err) {
    console.log(TAG, err.message);
  }
};

export const onInit = async (routeParams: PropsRouteParamsWriteColumn, ref) => {
  navigation.addListener('focus', () => {
    getDataDb(ref, routeParams);
  });
};

export const onDeInit = () => {};
