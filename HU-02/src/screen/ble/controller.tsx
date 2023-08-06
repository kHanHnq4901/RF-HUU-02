import React, {useContext, useState} from 'react';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {PropsStore, storeContext} from '../../store';
import {onScanPress} from './handleButton';

import * as permission from 'react-native-permissions';
import {
  requestPermissionBleConnectAndroid,
  requestPermissionGPSAndroid,
  requestPermissionGPSIos,
  requestPermissionScan,
} from '../../service/permission';
import {showAlert} from '../../util';
var LocationEnabler =
  Platform.OS === 'android' ? require('react-native-location-enabler') : null;

export type PropsItemBle = {
  isConnectable?: boolean;
  name: string;
  id: string;
  rssi?: number;
};

type PropsBLE = {
  isScan: boolean;

  listBondedDevice: PropsItemBle[];
  listNewDevice: {name: string; id: string; rssi: number}[];
  // idConnected: string | null;
};

export type HookState = {
  status: string;
  ble: PropsBLE;
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

const TAG = 'Ble Controller: ';

const BleManagerModule = NativeModules.BleManager;
// console.log(TAG, 'BleManagerModule:', BleManagerModule ? 'not null' : 'null');
export const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const hookProps = {} as HookProps;

export let store = {} as PropsStore;

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

export const requestGps = async (): Promise<boolean> => {
  try {
    const value = await turnOnLocation();
    if (value === true) {
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
    status: '',
    ble: {
      isScan: false,
      listBondedDevice: [],
      listNewDevice: [],
    },
  });
  hookProps.state = state;
  hookProps.setState = setState;

  store = useContext(storeContext) as PropsStore;

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
  return hookProps;
};

const handleStopScan = () => {
  hookProps.setState(state => {
    state.ble.isScan = false;
    return {...state};
  });
};

export const setStatus = (status: string) => {
  hookProps.setState(state => {
    state.status = status;
    return {...state};
  });
};

const handleDiscoverPeripheral = peripheral => {
  const peripherals = new Map();
  let res = peripheral as {
    advertising: {
      isConnectable: boolean;
      manufacturerData: any;
      serviceData: any;
      serviceUUIDs: [];
      txPowerLevel: number;
    };
    id: string;
    name: null | string;
    rssi: number;
  };
  //console.log('res:', res);
  if (res.name && res.advertising.isConnectable) {
    hookProps.state.ble.listNewDevice.forEach(itm => {
      peripherals.set(itm.id, {name: itm.name, id: itm.id, rssi: res.rssi});
    });
    peripherals.set(res.id, {name: res.name, id: res.id, rssi: res.rssi});

    hookProps.setState(state => {
      state.ble.listNewDevice = Array.from(peripherals.values());
      return {...state};
    });
    //refScroll.current.scrollToEnd({ animated: true });
    //refScroll.current.scrollTo({ x: 0, y: 0, animated: true });
  }
};

let listenerStopScan;
let listenerDiscover;

export const onInit = async navigation => {
  try {
    let requestScanPermission = await requestPermissionScan();
    let requestPermissionGps = await requestGps();
    if (requestScanPermission === true && requestPermissionGps === true) {
      await BleManager.start({showAlert: false});
      let isEnable: boolean = await BleManager.enableBluetooth();
      if (isEnable === true) {
        if (Platform.OS === 'android') {
          console.log('get list bond device');
          let list = await BleManager.getBondedPeripherals();
          hookProps.setState(state => {
            state.ble.listBondedDevice.length = 0;
            list.forEach(item => {
              state.ble.listBondedDevice.push({
                id: item.id,
                isConnectable: item.advertising.isConnectable,
                name: item.name ?? '',
              });
            });
            return {...state};
          });
        }
      } else {
        showAlert('Thiết bị cần được bật bluetooth');
      }
    }

    listenerStopScan = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      handleStopScan,
    );
    listenerDiscover = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );

    navigation.addListener('focus', () => {
      onScanPress();
    });
    navigation.addListener('beforeRemove', () => {
      BleManager.stopScan();
    });
  } catch (err) {
    setStatus('Lỗi: ' + err.message);
  }
};

export const onDeInit = () => {
  if (listenerStopScan && listenerDiscover) {
    listenerStopScan.remove();
    listenerDiscover.remove();
  }
};

type PropsListBondBle = {
  advertising: {
    isConnectable: boolean;
    localName: string;
    manufacturerData: any;
  };
  id: string;
  name: string;
  rssi: 0;
};
export const turnOnLocation = async (
  requestBle?: boolean,
): Promise<boolean> => {
  let ok: boolean = false;

  let result: permission.PermissionStatus = 'denied';

  if (Platform.OS === 'ios') {
    return await requestPermissionGPSIos();
  } else {
    if (requestBle !== false) {
      ok = await requestPermissionBleConnectAndroid();
    }
    ok = await requestPermissionGPSAndroid();
    return ok;
  }
};
