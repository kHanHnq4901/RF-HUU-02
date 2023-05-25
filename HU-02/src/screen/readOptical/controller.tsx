import React, {useState} from 'react';
import {PropsStore, storeContext} from '../../store';
import {USER_ROLE_TYPE} from '../../service/user';
import {store} from '../../component/drawer/drawerContent/controller';

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

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>(getInitialState());
  hookProps.state = state;
  hookProps.setState = setState;
  return hookProps;
};

export const onInit = async () => {};

export const onDeInit = () => {};
