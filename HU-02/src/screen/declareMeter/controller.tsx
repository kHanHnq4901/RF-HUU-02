import Geolocation from '@react-native-community/geolocation';
import React, { useState } from 'react';
import { PropsStore, storeContext } from '../../store';

import { Platform, ScrollView, TextInput } from 'react-native';
import { LatLng, MapMarker, Region } from 'react-native-maps';
import SelectDropdown from 'react-native-select-dropdown';
import {
  GetListLine,
  GetMeterModel,
  PropsGetMeterServer,
  PropsReturnGetListLine,
  PropsReturnGetModelMeter,
} from '../../service/api/index';
import { turnOnLocation } from '../ble/controller';
import { onGetPositionPress } from './handleButton';
import { UserImageProps } from '../../component/getPicture';
var LocationEnabler =
  Platform.OS === 'android' ? require('react-native-location-enabler') : null;

type PropsDeclareMeter = {
  selectedModelMeter: string | null;
  selectedStation: string | null;
};
export type HookState = {
  infoDeclare: PropsDeclareMeter;
  status: string;
  isBusy: boolean;
  data: PropsGetMeterServer;
  region: Region;
  position: LatLng | null;
  images: UserImageProps[];

  listStationObj: PropsReturnGetListLine;
  lisStationName: string[];
  listModelMeterObj: PropsReturnGetModelMeter;
  listModelMeterName: string[];
};

export type HookProps = {
  refSeriMeter: React.RefObject<TextInput>;
  refPhoneNUmber: React.RefObject<TextInput>;
  refCustomerName: React.RefObject<TextInput>;
  refCustomerCode: React.RefObject<TextInput>;
  refAddress: React.RefObject<TextInput>;
  refScroll: React.RefObject<ScrollView>;
  refStation: React.RefObject<SelectDropdown>;
  refModelMeter: React.RefObject<SelectDropdown>;

  refMarker: React.RefObject<MapMarker>;

  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
  // data: DataType;
};

const TAG = 'Header Controller: ';

export const hookProps = {} as HookProps;
export let store = {} as PropsStore;

// hookProps.data = {
//   infoDeclare: {
//     address: '',
//     customerCode: '',
//     customerName: '',
//     phoneNumber: '',
//     seriMeter: '',
//   },
// };

// export let ListStationObj: PropsReturnGetListLine = [];
// export let lisStationName: string[] = [];
// export let ListModelMeterObj: PropsReturnGetModelMeter = [];
// export let listModelMeterName: string[] = [];

const {
  PRIORITIES: { HIGH_ACCURACY },
  useLocationSettings,
} =
  Platform.OS === 'android'
    ? LocationEnabler.default
    : {
        PRIORITIES: { HIGH_ACCURACY: null },
        useLocationSettings: null,
      };

let enableLocationHook = {} as {
  enabled: any;
  requestResolution: () => void;
};

export function setStatus(str: string) {
  hookProps.setState(state => {
    state.status = str;
    return { ...state };
  });
}

export const requestGps = async (): Promise<boolean> => {
  try {
    const value = await turnOnLocation(false);
    if (value === true) {
      // console.log('value:', value);
      // console.log('enable:', enabled);

      if (Platform.OS === 'android') {
        if (enableLocationHook.enabled !== true) {
          enableLocationHook.requestResolution();
          return true;
        } else {
        }
      }

      return true;
    }
    if (value === false) {
      setStatus('Bật GPS cho chức năng tìm kiếm thiết bị Bluetooth');
    }
  } catch (err) {
    setStatus('Lỗi: ' + err.message);
  }

  return false;
};

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>({
    infoDeclare: {
      // seriMeter: '',
      // phoneNumber: '',
      // customerName: '',
      // customerCode: '',
      // address: '',
      // typeMeter: '',
      selectedModelMeter: null,
      selectedStation: null,
    },
    status: '',
    isBusy: false,
    data: {} as PropsGetMeterServer,
    region: {
      latitude: 21.108353280242344,
      latitudeDelta: 0.0022966737221068456,
      longitude: 105.99402224645019,
      longitudeDelta: 0.002686232328400706,
    },
    position: {
      latitude: 21.108353280242344,
      longitude: 105.99402224645019,
    },
    images: [],

    listStationObj: [],
    lisStationName: [],
    listModelMeterObj: [],
    listModelMeterName: [],
  });
  hookProps.state = state;
  hookProps.setState = setState;
  store = React.useContext(storeContext) as PropsStore;

  if (Platform.OS === 'android') {
    const [enabled, requestResolution] = useLocationSettings(
      {
        priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
        alwaysShow: true, // default false
        needBle: true, // default false
      },
      false /* optional: default undefined */,
    );
    enableLocationHook.enabled = enabled;
    enableLocationHook.requestResolution = requestResolution;
  }
  hookProps.refSeriMeter = React.createRef<TextInput>();
  hookProps.refPhoneNUmber = React.createRef<TextInput>();
  hookProps.refCustomerName = React.createRef<TextInput>();
  hookProps.refCustomerCode = React.createRef<TextInput>();
  hookProps.refAddress = React.createRef<TextInput>();
  hookProps.refScroll = React.createRef<ScrollView>();
  hookProps.refStation = React.createRef<SelectDropdown>();
  hookProps.refModelMeter = React.createRef<SelectDropdown>();
  hookProps.refMarker = React.createRef<MapMarker>();

  return hookProps;
};

let intervalGPS;

export const onInit = async () => {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
    locationProvider: 'playServices',
  });
  Geolocation.requestAuthorization(
    () => {
      console.log('requestAuthorization succeed');
      // if (!intervalGPS) {
      //   intervalGPS = setInterval(() => {
      //     getGeolocation();
      //   }, 7000);
      // }
      onGetPositionPress();
    },
    error => {
      console.log(error);
    },
  );
  requestGps();
  UpdateListLineAndModelMeter();
};

export async function UpdateListLineAndModelMeter() {
  hookProps.setState(state => {
    state.isBusy = true;
    return { ...state };
  });
  //hookProps.refStation.current?.reset();
  let response = await GetListLine();
  if (response.bSucceeded) {
    hookProps.state.listStationObj = response.obj;
    hookProps.state.lisStationName = [];
    for (let obj of hookProps.state.listStationObj) {
      hookProps.state.lisStationName.push(obj.LINE_NAME);
    }
    console.log('update list line succeed');

    //console.log('lisStationName:', lisStationName);
  } else {
    console.log('update list line failed: ', response);
  }

  response = await GetMeterModel();
  if (response.bSucceeded) {
    hookProps.state.listModelMeterObj = response.obj;
    hookProps.state.listModelMeterName = [];
    for (let obj of hookProps.state.listModelMeterObj) {
      hookProps.state.listModelMeterName.push(obj.METER_MODEL_DESC.slice(4));
    }
    console.log('update list model meter succeed');
    //console.log('lisStationName:', lisStationName);
  } else {
    console.log('update list model meter failed: ', response);
  }
  hookProps.setState(state => {
    state.isBusy = false;
    return { ...state };
  });
}

export const onDeInit = () => {
  if (intervalGPS) {
    clearInterval(intervalGPS);
  }
};
