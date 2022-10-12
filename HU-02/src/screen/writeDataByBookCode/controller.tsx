import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { PropsKHCMISModel } from '../../database/model';
import { CMISKHServices } from '../../database/service';
import {
  PropsRouteParamsWriteBook,
  StackWriteBookCodeNavigationProp,
} from '../../navigation/model/model';
import {
  getLabelAndIsManyPriceBy3Character,
  TYPE_READ_RF,
} from '../../service/hhu/defineEM';
import { PropsStore, storeContext } from '../../store/store';
import { dataDBTabel } from '../../database/model/index';
import { NativeScrollEvent, ScrollView } from 'react-native';
import { sizeScreen } from '../../theme/index';

export const itemPerRender = 10;

type PropsCheckBox = {
  checked: boolean;
  label: 'Chưa đọc' | 'Đọc lỗi' | 'Ghi tay' | 'Bất thường';
  // value: 'Chưa đọc' | 'Đọc lỗi' | 'Ghi tay' | 'Bất thường';
};

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

export type PropsTable = {
  render: PropsDatatable[];
  noRender: PropsDatatable[];
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

const TAG = ' Controller: ';

export const hookProps = {} as HookProps;
export let store = {} as PropsStore;
export let navigation: StackWriteBookCodeNavigationProp;
export let refScroll: React.MutableRefObject<ScrollView | null>;
//export const _nodes = new Map();

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

export function onScrollToEnd() {
  if (hookProps.state.dataTable.noRender.length > 0) {
    hookProps.setState(state => {
      state.dataTable = addMoreItemToRender(state.dataTable);
      return { ...state };
    });
  }
}

export function GetHookProps(): HookProps {
  const [state, setState] = useState<HookState>({
    arrColumnColumnCode: ['Tất cả'],
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
  navigation = useNavigation<StackWriteBookCodeNavigationProp>();
  refScroll = React.useRef<ScrollView | null>(null);
  return hookProps;
}

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

const getDataDb = async (ref, routeParams: PropsRouteParamsWriteBook) => {
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

  console.log(TAG, 'firstTime', firstTime);
  try {
    //if (store.state.appSetting.showResultOKInWriteData === true) {
    items = await CMISKHServices.findAll();
    dataDB = items;
    for (let item of dataDB) {
      if (item.MA_TRAM === routeParams.stationCode) {
        let ok = false;
        if (routeParams.bookCode.length > 0) {
          if (routeParams.bookCode.includes(item.MA_QUYEN)) {
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
          //break;
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
    );
    //console.log('show first:', dataTable[0]?.show);
    //console.log('arrStationCode:', arrStationCode);
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

export const onInit = async (routeParams: PropsRouteParamsWriteBook, ref) => {
  navigation.addListener('focus', () => {
    getDataDb(ref, routeParams);
  });
};

export const onDeInit = () => {};
