import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { store } from '../../component/drawer/drawerContent/controller';
import {
  PropsDataLogReadOptical,
  StackReadOpticalNavigationProp,
} from '../../navigation/model/model';
import { USER_ROLE_TYPE } from '../../service/user';
import { turnOnLocation } from '../ble/controller';
var LocationEnabler =
  Platform.OS === 'android' ? require('react-native-location-enabler') : null;

type RadioButton_Value = 'Dữ liệu gần nhất' | 'Theo thời gian' | 'Tức thời';

export const dataReadRadioButton: RadioButton_Value[] = Array.from(
  new Set<RadioButton_Value>([
    'Tức thời',
    'Dữ liệu gần nhất',
    'Theo thời gian',
  ]),
);

type RowTableProps = string[][]; //[[string, string]];

export const dataHeaderTable = ['Thông số', 'Giá trị'];

type PropsDataLatch = {
  time: string;
  cwData: string;
  UcwData: string;
};

type PropsTypeData =
  | 'Thông tin'
  | 'Dữ liệu'
  | 'Nbiot'
  | 'Thời gian gửi'
  | 'Sensor';

type PropsCheckBox = {
  label: PropsTypeData;
  value: PropsTypeData;
  checked?: boolean;
};

export type HookState = {
  status: string;
  dateStart: Date;
  dateEnd: Date;
  seri: string;
  rtc: string;
  voltage: string;
  instatntData: string;
  dataLatch: PropsDataLatch[];
  isReading: boolean;
  typeRead: RadioButton_Value;
  dataTable: RowTableProps;
  typeData: {
    items: PropsCheckBox[];
  };
  requestStop: boolean;
  is0h: boolean;
  isSaving: boolean;
  dataOpticalResPonseObj: PropsDataLogReadOptical;
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
};

const TAG = 'Header Controller: ';

export const hookProps = {} as HookProps;

function getInitialState(): HookState {
  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - 1);

  let value: HookState = {
    status: '',
    dateStart: startDate,
    dateEnd: endDate,
    seri: '2240000311',
    rtc: '2022/02/12 09:04:41',
    voltage: '3.67(V)',
    instatntData: '',
    dataLatch: [],
    isReading: false,
    typeRead: 'Dữ liệu gần nhất',
    dataTable: [['Điện áp', '3.67(V)']],
    typeData: {
      items: [
        {
          label: 'Thông tin',
          value: 'Thông tin',
        },
        {
          label: 'Dữ liệu',
          value: 'Dữ liệu',
        },
        {
          label: 'Thời gian gửi',
          value: 'Thời gian gửi',
        },
        {
          label: 'Nbiot',
          value: 'Nbiot',
        },
      ],
    },
    requestStop: false,
    is0h: false,
    isSaving: false,
    dataOpticalResPonseObj: {},
  };
  if (
    store.state.userInfo.USER_TYPE === USER_ROLE_TYPE.ADMIN ||
    store.state.userInfo.USER_TYPE === USER_ROLE_TYPE.STAFF
  ) {
    value.typeData.items.push({
      label: 'Sensor',
      value: 'Sensor',
    });
  }

  // value.typeData.items.push({
  //   label: 'Nbiot',
  //   value: 'Nbiot',
  // });
  // value.typeData.items.push({
  //   label: 'Thời gian gửi',
  //   value: 'Thời gian gửi',
  // });
  // value.typeData.items.push({
  //   label: 'Sensor',
  //   value: 'Sensor',
  // });

  return value;
}

export function setStatus(status: string) {
  hookProps.setState(state => {
    state.status = status;
    return { ...state };
  });
}

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

export let navigationStackReadOptical = {} as StackReadOpticalNavigationProp;

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>(getInitialState());
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
  hookProps.state = state;
  hookProps.setState = setState;

  navigationStackReadOptical = useNavigation<StackReadOpticalNavigationProp>();

  return hookProps;
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
      // if (!intervalGPS) {
      //   intervalGPS = setInterval(() => {
      //     getGeolocation();
      //   }, 7000);
      // }
      // onGetPositionPress();
    },
    error => {
      console.log(error);
    },
  );
  requestGps();

  // const obj = {
  //   'Seri đồng hồ': '2350001141',
  //   'Seri module': '2240000597',
  //   'Test RF': 'Thành công',
  //   Rssi: '99',
  //   'Có IP': 'NO_IP',
  //   QCCID: '8984012209500014329F',
  // };
  // ConvertObjToHook(obj);
};

export const onDeInit = () => {};
