import React, {useState} from 'react';
import {PropsKHCMISModel} from '../../database/model';
import {CMISKHServices} from '../../database/service';
import {TypeReadRF} from '../../service/hhu/RF/RfFunc';
import {PropsStore, storeContext} from '../../store';

// type PropsDataDB = {
//   item: PropsKHCMISModel;
//   //id: string;
// };

export type PropsTabel = {
  id: string;
  checked: boolean;
  show: boolean;
  columnCode: string;
  succeedMeter: string;
  totalMeter: string;
  capacityStation: string;
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
export let store = {} as PropsStore;

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
  store = React.useContext(storeContext) as PropsStore;
  return hookProps;
};
const getDataDb = async ref => {
  let items: PropsKHCMISModel[];
  let dataDB: PropsKHCMISModel[] = [];
  let stationCodeSet = new Set<string>();
  let totalMeterDBSet = new Set<string>();
  let arrStationCode: string[] = [];
  //let firstTime = hookProps.state.dataTabel.length === 0 ? true : false;

  console.log('getData DB');
  try {
    //if (store.state.appSetting.showResultOKInWriteData === true) {
    items = await CMISKHServices.findAll();
    dataDB = items;
    for (let item of dataDB) {
      stationCodeSet.add(item.MA_TRAM);
      totalMeterDBSet.add(item.SERY_CTO);
    }
    console.log('set:', stationCodeSet);

    arrStationCode = Array.from(stationCodeSet);
    console.log('arrStationCode:', arrStationCode);
    hookProps.setState(state => {
      state.dataDB = dataDB;
      state.totalMeter = totalMeterDBSet.size.toString();
      return {...state};
    });
    if (arrStationCode.length > 0) {
      ref?.current?.openDropdown();
    }
    //}
  } catch (err) {
    console.log(TAG, err.message);
  }
};

export const onInit = async (navigation, ref) => {
  navigation.addListener('focus', () => {
    getDataDb(ref);
  });
};

export const onDeInit = () => {};
