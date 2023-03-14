import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {NativeScrollEvent} from 'react-native';
import {dataDBTable, PropsKHCMISModel} from '../../database/model';
import {PropsCondition, PropsConditions} from '../../database/repository';
import {CMISKHServices} from '../../database/service';
import {
  PropsRouteParamsWriteStation,
  StackWriteStationCodeNavigationProp,
} from '../../navigation/model/model';
import {TYPE_READ_RF} from '../../service/hhu/defineEM';
import {sizeScreen} from '../../theme';
import {hookProps as selectStationCodeHook} from '../selectStationCode/controller';

type PropsCheckBox = {
  checked: boolean;
  label: 'Chưa đọc' | 'Đọc lỗi' | 'Ghi tay' | 'Bất thường';
  // value: 'Chưa đọc' | 'Đọc lỗi' | 'Ghi tay' | 'Bất thường';
};

// type PropsTypeReadData = {
//   value: string;
//   label: 'RF(Lora)' | 'Cổng quang';
// };
type PropsTypeReadData = 'RF(Lora)' | 'Cổng quang';

export const arrTypeRead: PropsTypeReadData[] = ['Cổng quang', 'RF(Lora)'];

const itemPerRender = 10;

export type PropsDataTable = {
  id: string;
  show: boolean;
  stt: string;
  checked: boolean;
  data: PropsKHCMISModel;
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
  totalSent2ServerSucceed: string;
  selectedColumn: string | null;
  typeRead: PropsTypeReadData;
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

export type PropsTable = {
  render: PropsDataTable[];
  noRender: PropsDataTable[];
};

const TAG = ' Controller: ';

export const hookProps = {} as HookProps;
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
      return {...state};
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
  return {...dataTable};
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
    totalSent2ServerSucceed: '0',
    typeRead: 'Cổng quang',
  });
  hookProps.state = state;
  hookProps.setState = setState;
  navigation = useNavigation<StackWriteStationCodeNavigationProp>();
  return hookProps;
};

const getDataDb = async (ref, routeParams: PropsRouteParamsWriteStation) => {
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
  let totalSent2ServerSucceed = 0;
  //let stt = 1;

  hookProps.setState(state => {
    state.status = 'Đang cập nhật dữ liệu ...';

    return {...state};
  });

  //console.log(TAG, 'routeParams', routeParams);

  const dateQuery =
    selectStationCodeHook.state.dateEnd.toLocaleDateString('vi');

  const conditions: PropsConditions = [];
  let condition = {
    data: {},
  } as PropsCondition;
  condition.data[dataDBTable.DATE_QUERY.id] = dateQuery;
  condition.logic = '=';
  condition.behindOperator = 'AND';

  conditions.push(condition);
  try {
    //if (store.state.appSetting.showResultOKInWriteData === true) {
    items = await CMISKHServices.findAll(undefined, conditions);
    dataDB = items;
    //console.log('index0:', dataDB[0]);

    for (let item of dataDB) {
      if (true) {
        let ok = false;
        if (routeParams.litStationCode.length > 0) {
          if (routeParams.litStationCode.includes(item.LINE_ID)) {
            ok = true;
          }
        } else {
          ok = true;
        }
        if (ok) {
          columnCodeSet.add(item.LINE_ID);
          //totalMeterDBSet.add(item.SERY_CTO);
          totalBCS++;
          if (
            item.TYPE_READ === TYPE_READ_RF.READ_SUCCEED ||
            item.TYPE_READ === TYPE_READ_RF.WRITE_BY_HAND
          ) {
            totalSucceed++;
          }

          if (item.IS_SENT === true) {
            totalSent2ServerSucceed++;
          }

          dataTable.noRender.push({
            checked: false,
            data: item,
            id: item.ID,
            show: true,
            stt: item.STT.toString(),
            labelMeter: '',
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
      state.totalSent2ServerSucceed = totalSent2ServerSucceed.toString();
      state.dataTable = dataTable;
      state.status = '';
      return {...state};
    });
    if (firstTime) {
      ref?.current?.openDropdown();
    }

    //}
  } catch (err) {
    console.log(TAG, err.message);
    hookProps.setState(state => {
      //state.dataDB = dataDB;

      state.status = 'Lỗi: ' + err.message;
      return {...state};
    });
  }
};

export const onInit = async (
  routeParams: PropsRouteParamsWriteStation,
  ref,
) => {
  navigation.addListener('focus', () => {
    getDataDb(ref, routeParams);
  });
};

export const onDeInit = () => {};
