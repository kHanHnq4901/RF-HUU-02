import React, {useState} from 'react';
import {store} from '../../component/drawer/drawerContent/controller';
import {PropsKHCMISModel} from '../../database/model';
import {CMISKHServices} from '../../database/service';
import {TypeReadRF} from '../../service/hhu/RF/RfFunc';
import {
  checkNetworkStatus,
  PropsInfoWM,
  PropsLineServer,
} from '../../service/user';
import {upDateMissData} from './handleButton';
import {GetListLine} from '../../service/api';

// type PropsDataDB = {
//   item: PropsKHCMISModel;
//   //id: string;
// };

export type PropsTabel = {
  id: string;
  checked: boolean;
  show: boolean;
  meterLine: PropsMeterLine;
};

export type PropsMeterLine = {
  listMeter: PropsInfoWM[];
  line: PropsLineServer;
};

export type HookState = {
  isBusy: boolean;
  isLoading: boolean;
  status: string;
  totalMeter: string;
  totalMeterStation: string;
  capacityStation: string;
  dataDB: PropsKHCMISModel[];
  dataTabel: PropsTabel[];
  checkAll: boolean;
  selectedStationCode: string | null;

  typeRead: TypeReadRF;
  is0h: boolean;
  dateStart: Date;
  dateEnd: Date;
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

const TAG = ' Controller: ';

export const hookProps = {} as HookProps;

export const GetHookProps = (): HookProps => {
  const dateEnd = new Date();
  dateEnd.setSeconds(0);
  const dateStart = new Date();
  dateStart.setSeconds(0);
  dateStart.setDate(dateEnd.getDate() - 5);
  const [state, setState] = useState<HookState>({
    isBusy: false,
    isLoading: false,
    status: '',
    totalMeter: '',
    totalMeterStation: '',
    capacityStation: '',
    //searchText: '',
    dataDB: [],
    //selectedDropdown: null,
    dataTabel: [],
    checkAll: false,
    selectedStationCode: null,
    typeRead: 'Theo thời gian',
    is0h: true,
    dateStart: dateStart,
    dateEnd: dateEnd,
  });
  hookProps.state = state;
  hookProps.setState = setState;
  return hookProps;
};

export const dataReadRadioButton: TypeReadRF[] = Array.from(
  new Set<TypeReadRF>(['Dữ liệu gần nhất', 'Theo thời gian']),
);

const getDataDb = async () => {
  let items: PropsKHCMISModel[];
  let dataDB: PropsKHCMISModel[] = [];
  let stationCodeSet = new Set<string>();
  let totalMeterDBSet = new Set<string>();
  let arrLineId: string[] = [];
  //let firstTime = hookProps.state.dataTabel.length === 0 ? true : false;

  console.log('getData DB');
  try {
    //if (store.state.appSetting.showResultOKInWriteData === true) {
    items = await CMISKHServices.findAll();
    dataDB = items;
    for (let item of dataDB) {
      stationCodeSet.add(item.LINE_ID);
      totalMeterDBSet.add(item.NO_MODULE);
    }
    //console.log('set:', stationCodeSet);

    arrLineId = Array.from(stationCodeSet);

    const dataTable: PropsTabel[] = [];
    for (let lineId of arrLineId) {
      const item = {
        meterLine: {},
      } as PropsTabel;
      item.checked = false;
      item.id = lineId;
      item.show = true;
      item.meterLine.line = {
        CODE: '',
        ADDRESS: '',
        LINE_ID: lineId,
        LINE_NAME: '',
      };
      item.meterLine.listMeter = [];
      for (let row of hookProps.state.dataDB) {
        if (row.LINE_ID === lineId && row.IS_SENT !== false) {
          item.meterLine.line.LINE_NAME = row.LINE_NAME;
          item.meterLine.listMeter.push({
            ADDRESS: row.ADDRESS,
            CREATED: '',
            CUSTOMER_CODE: row.CUSTOMER_CODE,
            CUSTOMER_NAME: row.CUSTOMER_NAME,
            EMAIL: row.EMAIL,
            LINE_NAME: row.LINE_NAME,
            METER_MODEL_DESC: '',
            METER_NAME: row.METER_NAME,
            METER_NO: row.NO_METER,
            MODULE_NO: row.NO_MODULE,
            PHONE: row.PHONE,
          });
        }
      }

      dataTable.push(item);
    }

    hookProps.setState(state => {
      state.dataTabel = dataTable;
      return {...state};
    });
    hookProps.setState(state => {
      state.dataDB = dataDB;
      state.totalMeter = totalMeterDBSet.size.toString();
      return {...state};
    });
    if (arrLineId.length > 0) {
      // ref?.current?.openDropdown();
    }
    //}
  } catch (err) {
    console.log(TAG, err.message);
  }
};

async function upDateLineAndMeterFromServer(): Promise<PropsMeterLine[]> {
  const ret: PropsMeterLine[] = [];

  try {
    const response = await GetListLine();
    if (response.bSucceeded) {
      const listStationObj: PropsLineServer[] = response.obj; //PropsReturnGetListLine
      // lisStationName = [];
      // for (let obj of ListStationObj) {
      //   lisStationName.push(obj.LINE_NAME);
      // }
      console.log('update list line succeed');

      for (let line of listStationObj) {
        const lineAndMeterObj: PropsMeterLine = {
          listMeter: [],
          line: {} as PropsLineServer,
        };
        lineAndMeterObj.line = line;
        ret.push(lineAndMeterObj);
      }
      //console.log('lisStationName:', lisStationName);
    } else {
      console.log('update list line failed: ', response);
    }
  } catch (err: any) {
    console.log(TAG, 'err', err.mess);
  }

  return ret;
}

export const onInit = async (navigation, ref) => {
  navigation.addListener('focus', async () => {
    try {
      hookProps.setState(state => {
        state.isLoading = true;
        return {...state};
      });

      if ((await checkNetworkStatus()) === true) {
        //getDataDb(ref);

        const listLineAndMeter = await upDateLineAndMeterFromServer();

        const dataTable: PropsTabel[] = [];
        for (let lineAndMeter of listLineAndMeter) {
          //console.log('line:', line);

          const item = {
            meterLine: {},
          } as PropsTabel;
          item.checked = false;
          item.id = lineAndMeter.line.LINE_ID;
          item.show = true;
          item.meterLine.line = lineAndMeter.line;
          item.meterLine.listMeter = lineAndMeter.listMeter;

          dataTable.push(item);
        }

        hookProps.setState(state => {
          state.dataTabel = dataTable;
          return {...state};
        });
        if (hookProps.state.typeRead === 'Dữ liệu gần nhất') {
          upDateMissData(new Date(), true);
        } else {
          upDateMissData(hookProps.state.dateEnd, true);
        }
      } else {
        //await getDataDb();
      }
    } catch (err: any) {
    } finally {
      hookProps.setState(state => {
        state.isLoading = false;
        return {...state};
      });
    }
  });
};

export const onDeInit = () => {};
