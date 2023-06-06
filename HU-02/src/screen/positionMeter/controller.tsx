import React, {useState} from 'react';
import {PropsStore, storeContext} from '../../store';
import {turnOnLocation} from '../ble/controller';
import {Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {PropsGetMeterServer} from '../../service/api';
var LocationEnabler =
  Platform.OS === 'android' ? require('react-native-location-enabler') : null;

export type HookState = {
  seri: string;
  currentGPS: string;
  isBusy: boolean;
  status: string;
  data: PropsGetMeterServer;
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

const TAG = 'Header Controller: ';

const {
  PRIORITIES: {HIGH_ACCURACY},
  useLocationSettings,
} =
  Platform.OS === 'android'
    ? LocationEnabler.default
    : {
        PRIORITIES: {HIGH_ACCURACY: null},
        useLocationSettings: null,
      };

let enableLocationHook = {} as {
  enabled: any;
  requestResolution: () => void;
};

function setStatus(str: string) {
  hook.setState(state => {
    state.status = str;
    return {...state};
  });
}

const requestGps = async (): Promise<boolean> => {
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

export const hook = {} as HookProps;
export let store = {} as PropsStore;

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>({
    seri: '',
    currentGPS: '',
    isBusy: false,
    status: '',
    data: {} as PropsGetMeterServer,
  });
  hook.state = state;
  hook.setState = setState;
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

  return hook;
};

export const onInit = async () => {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
    locationProvider: 'playServices',
  });
  Geolocation.requestAuthorization(
    () => {
      console.log('requestAuthorization succeed');
    },
    error => {
      console.log(error);
    },
  );
  requestGps();
};

export const onDeInit = () => {};
