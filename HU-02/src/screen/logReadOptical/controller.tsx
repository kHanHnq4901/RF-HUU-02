import React, { useState } from 'react';
import { Region } from 'react-native-maps';
import { UserImageProps } from '../../component/getPicture';
import { PropsDataLogReadOptical } from '../../navigation/model/model';
import { PropsStore, storeContext } from '../../store';
import { onGetPositionPress } from './handleButton';

type PropsData = {
  seriModule: string;
  seriMeter: string;
  QCCID: string;
  rssi: string;
  active: string;
  fixed: boolean;
  registerModule: string;
  registerMeter: string;
  deltaRegister: string;
  note: string;
};

export type HookState = {
  data: PropsData;
  region: Region;
  images: UserImageProps[];
  isBusy: boolean;
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

const TAG = 'Header Controller: ';

export const hookProps = {} as HookProps;
export let store = {} as PropsStore;

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>({
    data: {
      seriModule: '',
      seriMeter: '',
      QCCID: '',
      rssi: '',
      active: '',
      registerModule: '',
      registerMeter: '',
      note: '',
      fixed: false,
      deltaRegister: '',
    },
    region: {
      latitude: 21.108353280242344,
      latitudeDelta: 0.0022966737221068456,
      longitude: 105.99402224645019,
      longitudeDelta: 0.002686232328400706,
    },
    images: [],
    isBusy: false,
  });
  hookProps.state = state;
  hookProps.setState = setState;
  store = React.useContext(storeContext) as PropsStore;
  return hookProps;
};

export const onInit = async (data?: PropsDataLogReadOptical) => {
  // console.log('data:', data);
  const _data: PropsData = hookProps.state.data;
  for (let itm in _data) {
    _data[itm] = '';
  }
  if (data) {
    let item = data?.['Seri đồng hồ'];
    if (item) {
      _data.seriMeter = item;
    }
    item = data?.['Seri module'];
    if (item) {
      _data.seriModule = item;
    }
    item = data?.['Dữ liệu'];
    if (item) {
      _data.registerModule = item;
    }
    item = data?.QCCID;
    if (item) {
      _data.QCCID = item;
    }
    item = data?.Rssi;
    if (item) {
      _data.rssi = item;
    }
  } else {
  }
  hookProps.setState(state => {
    state.data = _data;
    return { ...state };
  });
  onGetPositionPress();
};

export const onDeInit = () => {};
