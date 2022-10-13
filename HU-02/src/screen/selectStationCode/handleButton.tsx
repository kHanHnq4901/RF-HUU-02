import { Alert } from 'react-native';
import {
  StackWriteBookCodeNavigationProp,
  StackWriteStationCodeNavigationProp,
} from '../../navigation/model/model';
import { TYPE_READ_RF } from '../../service/hhu/defineEM';
import { hookProps, PropsTabel } from './controller';

export const onDropdownSelected = (stationName: string) => {
  let meterStationSet = new Set<string>();
  let columnCodeSet = new Set<string>();
  let totalBCSStation = 0;
  let totalCapacityStation = 0;
  for (let item of hookProps.state.dataDB) {
    if (item.MA_TRAM === stationName) {
      meterStationSet.add(item.SERY_CTO);
      columnCodeSet.add(item.MA_COT);
      totalBCSStation += 1;
      totalCapacityStation += Number(item.CS_MOI);
    }
  }
  let dataTable: PropsTabel[] = [];
  columnCodeSet.forEach(columnCode => {
    //console.log('bookCode:', bookCode);
    let totalMeterReadSucceed = 0;
    let totalCapacityBook = 0;
    let totalMeter = 0;
    for (let item of hookProps.state.dataDB) {
      if (item.MA_COT === columnCode) {
        totalMeter++;
        if (item.LoaiDoc === TYPE_READ_RF.READ_SUCCEED) {
          totalMeterReadSucceed++;
          totalCapacityBook += Number(item.CS_MOI) - Number(item.CS_CU);
        }
      }
    }
    dataTable.push({
      id: columnCode,
      columnCode: columnCode,
      succeedMeter: totalMeterReadSucceed.toString(),
      capacityStation: totalCapacityBook.toFixed(0),
      totalMeter: totalMeter.toString(),
      checked: false,
      show: true,
    });
  });
  dataTable = dataTable.sort((a, b) =>
    a.columnCode.localeCompare(b.columnCode),
  );
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
      if (item.columnCode.toLowerCase().includes(value.toLowerCase())) {
        item.show = true;
      } else {
        item.show = false;
      }
      return { ...item };
    });
    return { ...state };
  });
};

export const onOKPress = (navigation: StackWriteStationCodeNavigationProp) => {
  if (!hookProps.state.selectedStationCode) {
    Alert.alert('', 'Chưa chọn mã trạm');
    return;
  }

  let arrCodeColumn: string[] = [];
  for (let item of hookProps.state.dataTabel) {
    if (item.checked && item.show) {
      arrCodeColumn.push(item.columnCode);
    }
  }
  console.log('arrCodeColumn:', arrCodeColumn);
  navigation.navigate('WriteColumn', {
    columnCode: arrCodeColumn,
    stationCode: hookProps.state.selectedStationCode,
  });
};
