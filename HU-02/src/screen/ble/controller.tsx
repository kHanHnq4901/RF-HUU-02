import React, {useContext, useState} from 'react';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import {PropsStore, storeContext} from '../../store';
import BleManager from '../../util/BleManager';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {onScanPress} from './handleButton';
import LocationEnabler from 'react-native-location-enabler';
import * as permission from 'react-native-permissions';

export type PropsItemBle = {
  isConnectable?: boolean;
  name: string;
  id: string;
};

type PropsBLE = {
  isScan: boolean;

  listBondedDevice: PropsItemBle[];
  listNewDevice: {name: string; id: string}[];
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

export const requestPermissionScan = async (): Promise<boolean> => {
  try {
    //let status;

    const OsVer = Number(Platform.constants.Release);

    //console.log('OsVer:', JSON.stringify(Platform));
    console.log('OsVer:', OsVer);

    if (OsVer < 12) {
      return true;
    }

    let result = await permission.check(
      permission.PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
    );
    switch (result) {
      case permission.RESULTS.UNAVAILABLE:
        console.log(
          TAG,
          'BLUETOOTH_SCAN',
          'This feature is not available (on this device / in this context)',
        );
        break;
      case permission.RESULTS.DENIED:
        console.log(
          TAG,
          'BLUETOOTH_SCAN',
          'The permission has not been requested / is denied but requestable',
        );
        let status = await permission.request(
          permission.PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        );
        if (
          status === permission.RESULTS.GRANTED ||
          status === permission.RESULTS.BLOCKED
        ) {
          console.log(TAG, 'BLUETOOTH_SCAN', 'The permission is granted');
          return true;
        } else {
          return false;
        }

      case permission.RESULTS.LIMITED:
        console.log(
          TAG,
          'BLUETOOTH_SCAN',
          'The permission is limited: some actions are possible',
        );
        break;
      case permission.RESULTS.GRANTED:
        console.log(TAG, 'BLUETOOTH_SCAN', 'The permission is granted');
        return true;
      case permission.RESULTS.BLOCKED:
        console.log(
          TAG,
          'BLUETOOTH_SCAN',
          'The permission is denied and not requestable anymore',
        );
        return true;
    }
    return false;
  } catch (err) {
    console.log(TAG, 'BLUETOOTH_SCAN', err.message);
    return false;
  }
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

const BleManagerModule = NativeModules.BleManager;
export const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

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
  if (res.name !== null && res.advertising.isConnectable) {
    hookProps.state.ble.listNewDevice.forEach(itm => {
      peripherals.set(itm.id, {name: itm.name, id: itm.id});
    });
    peripherals.set(res.id, {name: res.name, id: res.id});

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
      await BleManager.enableBluetooth();
      let list: PropsListBondBle[] = await BleManager.getBondedPeripherals();
      hookProps.setState(state => {
        state.ble.listBondedDevice.length = 0;
        list.forEach(item => {
          state.ble.listBondedDevice.push({
            id: item.id,
            isConnectable: item.advertising.isConnectable,
            name: item.name,
          });
        });
        return {...state};
      });
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

export const turnOnLocation = async (): Promise<boolean> => {
  let result = await check(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
  let ok: boolean = false;
  switch (result) {
    case RESULTS.UNAVAILABLE:
      // console.log(
      //   'This feature BLUETOOTH_CONNECT is not available (on this device / in this context)',
      // );
      break;
    case RESULTS.DENIED:
      console.log(
        'The permission BLUETOOTH_CONNECT has not been requested / is denied but requestable',
      );
      break;
    case RESULTS.LIMITED:
      // console.log('The permission is limited: some actions are possible');
      ok = true;
      break;
    case RESULTS.GRANTED:
      // console.log('The permission is granted');
      ok = true;
      break;
    case RESULTS.BLOCKED:
      // console.log('The permission is denied and not requestable anymore');
      ok = true;
      break;
  }
  result = await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
  ok = false;
  switch (result) {
    case RESULTS.UNAVAILABLE:
      // console.log(
      //   'This feature BLUETOOTH_CONNECT is not available (on this device / in this context)',
      // );
      break;
    case RESULTS.DENIED:
      console.log(
        'The permission BLUETOOTH_CONNECT has not been requested / is denied but requestable',
      );
      break;
    case RESULTS.LIMITED:
      // console.log('The permission is limited: some actions are possible');
      ok = true;
      break;
    case RESULTS.GRANTED:
      // console.log('The permission is granted');
      ok = true;
      break;
    case RESULTS.BLOCKED:
      // console.log('The permission is denied and not requestable anymore');
      ok = true;
      break;
  }
  result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  ok = false;
  switch (result) {
    case RESULTS.UNAVAILABLE:
      console.log(
        'This feature ACCESS_FINE_LOCATION is not available (on this device / in this context)',
      );
      break;
    case RESULTS.DENIED:
      console.log(
        'The permission ACCESS_FINE_LOCATION has not been requested / is denied but requestable',
      );
      break;
    case RESULTS.LIMITED:
      // console.log('The permission is limited: some actions are possible');
      ok = true;
      break;
    case RESULTS.GRANTED:
      // console.log('The permission is granted');
      ok = true;
      break;
    case RESULTS.BLOCKED:
      // console.log('The permission is denied and not requestable anymore');
      ok = true;
      break;
  }

  if (ok === false) {
    result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log(
          'This feature ACCESS_FINE_LOCATION is not available (on this device / in this context)',
        );
        break;
      case RESULTS.DENIED:
        console.log(
          'The permission ACCESS_FINE_LOCATION has not been requested / is denied but requestable',
        );
        break;
      case RESULTS.LIMITED:
        console.log(
          'The permission ACCESS_FINE_LOCATION is limited: some actions are possible',
        );
        ok = true;
        break;
      case RESULTS.GRANTED:
        console.log('The permission ACCESS_FINE_LOCATION is granted');
        ok = true;
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        ok = true;
        break;
    }
  }
  //console.log('ok:', ok);
  return ok;
};
