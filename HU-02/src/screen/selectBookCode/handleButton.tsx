import { Alert } from 'react-native';
import { StackWriteBookCodeNavigationProp } from '../../navigation/model/model';
import { TYPE_READ_RF } from '../../service/hhu/defineEM';
import { hookProps, PropsTabel } from './controller';

export const onDropdownSelected = (stationName: string) => {
  let meterStationSet = new Set<string>();
  let bookCodeSet = new Set<string>();
  let totalBCSStation = 0;
  let totalCapacityStation = 0;
  for (let item of hookProps.state.dataDB) {
    if (item.MA_TRAM === stationName) {
      meterStationSet.add(item.SERY_CTO);
      bookCodeSet.add(item.MA_QUYEN);
      totalBCSStation += 1;
      totalCapacityStation += Number(item.CS_MOI);
    }
  }
  let dataTable: PropsTabel[] = [];
  bookCodeSet.forEach(bookCode => {
    //console.log('bookCode:', bookCode);
    let totalMeterReadSucceed = 0;
    let totalCapacityBook = 0;
    let totalMeter = 0;
    for (let item of hookProps.state.dataDB) {
      if (item.MA_QUYEN === bookCode) {
        totalMeter++;
        if (item.LoaiDoc === TYPE_READ_RF.READ_SUCCEED) {
          totalMeterReadSucceed++;
          totalCapacityBook += Number(item.CS_MOI) - Number(item.CS_CU);
        }
      }
    }
    dataTable.push({
      id: bookCode,
      bookCode: bookCode,
      succeedMeter: totalMeterReadSucceed.toString(),
      capacityStation: totalCapacityBook.toFixed(0),
      totalMeter: totalMeter.toString(),
      checked: false,
      show: true,
    });
  });
  hookProps.setState(state => {
    state.dataTabel = dataTable;
    state.totalMeterStation = meterStationSet.size.toString();
    state.totalBCSStation = totalBCSStation.toString();
    state.capacityStation = totalCapacityStation.toFixed(0);
    state.selectedStationCode = stationName;

    return { ...state };
  });
};

export const onChangeTextSearch = (value: string) => {
  //console.log('a');
  hookProps.setState(state => {
    state.dataTabel = state.dataTabel.map(item => {
      if (item.bookCode.toLowerCase().includes(value.toLowerCase())) {
        item.show = true;
      } else {
        item.show = false;
      }
      return { ...item };
    });
    return { ...state };
  });
};

export const onOKPress = (navigation: StackWriteBookCodeNavigationProp) => {
  if (!hookProps.state.selectedStationCode) {
    Alert.alert('', 'Chưa chọn mã trạm');
    return;
  }

  let arrCodeBook: string[] = [];
  for (let item of hookProps.state.dataTabel) {
    if (item.checked && item.show) {
      arrCodeBook.push(item.bookCode);
    }
  }
  navigation.navigate('WriteBook', {
    bookCode: arrCodeBook,
    stationCode: hookProps.state.selectedStationCode,
  });
};
