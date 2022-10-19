import {Alert} from 'react-native';
import {StackWriteStationCodeNavigationProp} from '../../navigation/model/model';
import {TYPE_READ_RF} from '../../service/hhu/defineEM';
import {getMeterListMissByLine} from '../../service/user';
import {hookProps, PropsTabel, store} from './controller';

const TAG = 'handlebutton Select station code';

export const onChangeTextSearch = (value: string) => {
  //console.log('a');
  hookProps.setState(state => {
    state.dataTabel = state.dataTabel.map(item => {
      if (item.columnCode.toLowerCase().includes(value.toLowerCase())) {
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
      listStationCode.push(item.columnCode);
    }
  }
  console.log('arrCodeColumn:', listStationCode);
  navigation.navigate('WriteStation', {
    litStationCode: listStationCode,
  });
};

let updateBusy = false;
export async function upDateMissData(date: Date) {
  if (updateBusy === true) {
    return;
  }
  try {
    updateBusy = true;
    for (let line of store.state.meter.listLine) {
      const response = await getMeterListMissByLine(line.LINE_ID, date);
      console.log(TAG, response);
    }
  } catch (err) {
    console.log(TAG, err.message);
  } finally {
    updateBusy = false;
  }
}
