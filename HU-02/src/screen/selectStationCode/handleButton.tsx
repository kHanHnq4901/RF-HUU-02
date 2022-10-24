import {Alert} from 'react-native';
import {dataDBTable, PropsKHCMISModel} from '../../database/model';
import {
  checkTabelDBIfExist,
  deleteDataDB,
  deleteDB,
  KHCMISRepository,
  PropsCondition,
  PropsConditions,
} from '../../database/repository';
import {StackWriteStationCodeNavigationProp} from '../../navigation/model/model';
import {TYPE_READ_RF} from '../../service/hhu/defineEM';
import {getMeterListMissByLine} from '../../service/user';
import {hookProps, PropsMeterLine, PropsTabel, store} from './controller';
import {dummyDataTable} from '../overview/controller';
import {CMISKHServices, PropsKHCMISModelSave} from '../../database/service';

const TAG = 'handlebutton Select station code';

export const onChangeTextSearch = (value: string) => {
  //console.log('a');
  hookProps.setState(state => {
    state.dataTabel = state.dataTabel.map(item => {
      if (
        item.meterLine.line.LINE_NAME.toLowerCase().includes(
          value.toLowerCase(),
        )
      ) {
        item.show = true;
      } else {
        item.show = false;
      }
      return {...item};
    });
    return {...state};
  });
};

export const onOKPress = (navigation: StackWriteStationCodeNavigationProp) => {
  let listStationCode: string[] = [];
  for (let item of hookProps.state.dataTabel) {
    if (item.checked && item.show) {
      listStationCode.push(item.meterLine.line.LINE_ID);
    }
  }
  console.log('arrCodeColumn:', listStationCode);
  navigation.navigate('WriteStation', {
    litStationCode: listStationCode,
  });
};

let updateBusy = false;
let lastDateExecute: Date | null = null;
export async function upDateMissData(date: Date) {
  if (
    lastDateExecute !== null &&
    lastDateExecute.getTime() === date.getTime()
  ) {
    return;
  }

  if (updateBusy === true && hookProps.state.isLoading === true) {
    return;
  }
  try {
    updateBusy = true;
    hookProps.setState(state => {
      state.isLoading = true;
      return {...state};
    });
    const dataTable: PropsTabel[] = [];
    for (let data of hookProps.state.dataTabel) {
      const response = await getMeterListMissByLine(
        data.meterLine.line.LINE_ID,
        date,
      );
      if (response.succeed === true) {
        lastDateExecute = date;
        data.meterLine.listMeter = response.data;
      } else {
        data.meterLine.listMeter = [];
      }
      dataTable.push(data);

      //console.log(TAG, response);
    }
    hookProps.setState(state => {
      state.dataTabel = dataTable;
      return {...state};
    });
  } catch (err) {
    console.log(TAG, err.message);
  } finally {
    updateBusy = false;
    hookProps.setState(state => {
      state.isLoading = false;
      return {...state};
    });
  }
}

export async function onTestPress() {
  // await deleteDB();
  // await checkTabelDBIfExist();
  // await CMISKHServices.findAll();
  // return;
  let res: boolean = false;
  // delete
  const dateQuery = hookProps.state.dateEnd;
  for (let data of hookProps.state.dataTabel) {
    const conditions: PropsConditions = [];
    let condition = {
      data: {},
    } as PropsCondition;
    condition.data[dataDBTable.DATE_QUERY.id] = dateQuery;
    condition.logic = '=';
    condition.behindOperator = 'AND';

    conditions.push(condition);

    condition = {
      data: {},
    } as PropsCondition;
    condition.data[dataDBTable.LINE_ID.id] = data.meterLine.line.LINE_ID;
    condition.logic = '=';
    condition.behindOperator = 'AND';

    conditions.push(condition);

    condition = {
      data: {},
    } as PropsCondition;
    condition.data[dataDBTable.IS_SENT.id] = 'false';
    condition.logic = '!=';
    condition.behindOperator = 'AND';

    conditions.push(condition);

    res = await KHCMISRepository.delete(conditions);

    console.log('res delete:', res);
  }

  // save

  for (let data of hookProps.state.dataTabel) {
    const station = data.meterLine;
    let stt = 0;
    for (let meter of station.listMeter) {
      stt++;
      const item: PropsKHCMISModelSave = {
        ADDRESS: meter.ADDRESS,
        CUSTOMER_CODE: meter.CUSTOMER_CODE,
        CUSTOMER_NAME: meter.CUSTOMER_NAME,
        DATA: [],
        DATE_QUERY: hookProps.state.dateEnd.toLocaleDateString('vi'),
        EMAIL: meter.EMAIL,
        LINE_ID: station.line.LINE_ID,
        LINE_NAME: station.line.LINE_NAME,
        METER_NAME: meter.METER_NAME,
        PHONE: meter.PHONE,
        POINT_CODE_MEASUREMENT: '',
        NO_METER: meter.METER_NO,
        NO_MODULE: meter.MODULE_NO,
        STT: stt,
      };
      res = await CMISKHServices.save(item);
    }

    console.log('res save:', res);
  }
}
