import React, {useState} from 'react';
import {PropsStore, storeContext} from '../../store';

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

type PropsTypeData = 'Thông tin' | 'Dữ liệu';

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
export let store = {} as PropsStore;

function getInitialState(): HookState {
  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - 1);

  return {
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
      ],
    },
    requestStop: false,
    is0h: false,
  };
}

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>(getInitialState());
  hookProps.state = state;
  hookProps.setState = setState;
  store = React.useContext(storeContext) as PropsStore;
  return hookProps;
};

export const onInit = async () => {};

export const onDeInit = () => {};
