import React, {useState} from 'react';
import {PropsStore, storeContext} from '../../store';
import Geolocation from '@react-native-community/geolocation';
import LocationEnabler from 'react-native-location-enabler';
import {turnOnLocation} from '../ble/controller';

export type HookState = {
  seri: string;
  status: string;
  isBusy: boolean;
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

const TAG = 'Header Controller: ';

export const hookProps = {} as HookProps;
export let store = {} as PropsStore;

const {
  PRIORITIES: {HIGH_ACCURACY},
  useLocationSettings,
} = LocationEnabler;

let enableLocationHook = {} as {
  enabled: any;
  requestResolution: () => void;
};

export function setStatus(str: string) {
  hookProps.setState(state => {
    state.status = str;
    return {...state};
  });
}

export const requestGps = async (): Promise<boolean> => {
  try {
    const value = await turnOnLocation();
    if (value === true) {
      // console.log('value:', value);
      // console.log('enable:', enabled);
      if (enableLocationHook.enabled !== true) {
        enableLocationHook.requestResolution();
        return true;
      } else {
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
    seri: '12345678',
    status: '',
    isBusy: false,
  });
  hookProps.state = state;
  hookProps.setState = setState;
  store = React.useContext(storeContext) as PropsStore;

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

  return hookProps;
};

export const onInit = async () => {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
    locationProvider: 'auto',
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
