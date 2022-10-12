import React, { useState } from 'react';
import { PropsKHCMISModel } from '../../database/model';
import { CMISKHServices } from '../../database/service';
import { PropsStore, storeContext } from '../../store';

// type PropsDataDB = {
//   item: PropsKHCMISModel;
//   //id: string;
// };

export type PropsTabel = {
  id: string;
  checked: boolean;
  show: boolean;
  bookCode: string;
  succeedMeter: string;
  totalMeter: string;
  capacityStation: string;
};
export type HookState = {
  isBusy: boolean;
  isLoading: boolean;
  status: string;
  totalMeter: string;
  totalBCS: string;
  totalMeterStation: string;
  totalBCSStation: string;
  capacityStation: string;
  //searchText: string;
  dataDB: PropsKHCMISModel[];
  dropdownStationCode: string[];
  //selectedDropdown: string | null;
  dataTabel: PropsTabel[];
  checkAll: boolean;
  selectedStationCode: string | null;
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

const TAG = ' Controller: ';

export const hookProps = {} as HookProps;
export let store = {} as PropsStore;

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>({
    isBusy: false,
    isLoading: false,
    status: '',
    totalMeter: '',
    totalBCS: '',
    totalMeterStation: '',
    totalBCSStation: '',
    capacityStation: '',
    //searchText: '',
    dataDB: [],
    dropdownStationCode: [],
    //selectedDropdown: null,
    dataTabel: [],
    checkAll: false,
    selectedStationCode: null,
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
      //state.searchText = '';
      state.dataDB = dataDB;
      state.dropdownStationCode = arrStationCode;
      state.totalMeter = totalMeterDBSet.size.toString();
      state.totalBCS = dataDB.length.toString();
      return { ...state };
    });
    if (arrStationCode.length > 0) {
      ref.current?.openDropdown();
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
