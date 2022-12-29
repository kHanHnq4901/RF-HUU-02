import React, {useState} from 'react';
import {PropsStore, storeContext} from '../../store';
import Geolocation from '@react-native-community/geolocation';
import LocationEnabler from 'react-native-location-enabler';
import {turnOnLocation} from '../ble/controller';
import {TextInput} from 'react-native';
import {TYPE_MODEL_METER} from '../../service/hhu/defineWM';
import {
  GetListLine,
  GetMeterModel,
  PropsReturnGetListLine,
  PropsReturnGetModelMeter,
} from '../../service/api/index';
import {flowRight} from 'lodash';

type PropsDeclareMeter = {
  seriMeter: string;
  phoneNumber: string;
  customerName: string;
  customerCode: string;
  address: string;
  idStation: string;
  typeMeter: string;
  selectedModelMeter: string | null;
  selectedStation: string | null;
};

export type HookState = {
  infoDeclare: PropsDeclareMeter;
  status: string;
  isBusy: boolean;
};

export type HookProps = {
  refSeriMeter: React.RefObject<TextInput>;
  refPhoneNUmber: React.RefObject<TextInput>;
  refCustomerName: React.RefObject<TextInput>;
  refCustomerCode: React.RefObject<TextInput>;
  refAddress: React.RefObject<TextInput>;
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

const TAG = 'Header Controller: ';

export const hookProps = {} as HookProps;
export let store = {} as PropsStore;

export const ListModelMeter: TYPE_MODEL_METER[] = [
  'EW001C_EW-15P1',
  'EW001D_EW-15M1',
  'EW001E_EW-15M1',
  'EW001F_EW-15M2',
  'EW002C_EW-15P2',
];

export let ListStationObj: PropsReturnGetListLine = [];
export let lisStationName: string[] = [];
export let ListModelMeterObj: PropsReturnGetModelMeter = [];
export let listModelMeterName: string[] = [];

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
    infoDeclare: {} as PropsDeclareMeter,
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

  hookProps.refSeriMeter = React.createRef<TextInput>();
  hookProps.refPhoneNUmber = React.createRef<TextInput>();
  hookProps.refCustomerName = React.createRef<TextInput>();
  hookProps.refCustomerCode = React.createRef<TextInput>();
  hookProps.refAddress = React.createRef<TextInput>();

  return hookProps;
};

export const onInit = async () => {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
    locationProvider: 'android',
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
  if (ListStationObj.length === 0) {
    const response = await GetListLine();
    if (response.bSucceeded) {
      ListStationObj = response.obj;
      lisStationName = [];
      for (let obj of ListStationObj) {
        lisStationName.push(obj.LINE_NAME);
      }
      console.log('update list line succeed');
      //console.log('lisStationName:', lisStationName);
    } else {
      console.log('update list line failed: ', response);
    }
  }
  if (ListModelMeterObj.length === 0) {
    const response = await GetMeterModel();
    if (response.bSucceeded) {
      ListModelMeterObj = response.obj;
      listModelMeterName = [];
      for (let obj of ListModelMeterObj) {
        listModelMeterName.push(obj.METER_MODEL_DESC);
      }
      console.log('update list model meter succeed');
      //console.log('lisStationName:', lisStationName);
    } else {
      console.log('update list model meter failed: ', response);
    }
  }
};

export const onDeInit = () => {};
