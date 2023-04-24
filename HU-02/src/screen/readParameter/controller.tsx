import React, {useContext, useRef, useState} from 'react';
import {TypeReadRF} from '../../service/hhu/RF/RfFunc';
import {PropsCheckBox, TYPE_METER} from '../../service/hhu/defineEM';
import {getArrSeri, saveArrSeri} from '../../service/storage';
import {PropsStore, storeContext} from '../../store';
import {arrSeri, setArrSeri} from './handleButton';
import {TextInput} from 'react-native';

type StateProps = {
  status: string;
  requestStop: boolean;
  seri: string;
  typeRead: TypeReadRF;
  is0h: boolean;
  typeMeter: TYPE_METER;
  dataTable: RowTableProps;
  isReading: boolean;
  numberRetries: string;
  dateStart: Date;
  dateEnd: Date;
  registerMeter: string;
  registerModule: string | undefined;
  userNote: string;
  deltaRegister: string;
};

export const itemTypeMeter: PropsCheckBox[] = [
  {
    label: 'Đồng hồ',
    value: 'Đồng hồ',
  },
  {
    label: 'Repeater',
    value: 'Repeater',
  },
];

export const dataReadRadioButton: TypeReadRF[] = Array.from(
  new Set<TypeReadRF>(['Tức thời', 'Dữ liệu gần nhất', 'Theo thời gian']),
);

type HookProps = {
  state: StateProps;
  setState: React.Dispatch<React.SetStateAction<StateProps>>;
  registerMeter: {
    value: string;
    ref: React.RefObject<TextInput>;
  };
  userNote: {
    value: string;
    ref: React.RefObject<TextInput>;
  };
};

type RowTableProps = string[][]; //[[string, string]];

export const dataHeaderTable = ['Thông số', 'Giá trị'];

export const hookProps = {} as HookProps;
export let store = {} as PropsStore;

function GetInitialState(): StateProps {
  const dateEnd = new Date();
  dateEnd.setSeconds(0);
  const dateStart = new Date();
  dateStart.setSeconds(0);
  dateStart.setDate(dateEnd.getDate() - 1);
  return {
    status: '',
    requestStop: false,
    seri: '',
    typeRead: 'Tức thời',
    dataTable: [
      ['Điện áp', '0 (V)'],
      ['Dữ liệu', '0 (lít)'],
    ],
    is0h: false,
    isReading: false,
    numberRetries: '1',
    dateStart: dateStart,
    dateEnd: dateEnd,
    typeMeter: 'Đồng hồ',
    registerMeter: '',
    registerModule: '',
    userNote: '',
    deltaRegister: '',
  };
}

export const GetHookProps = (): HookProps => {
  store = useContext(storeContext);
  const [state, setState] = useState<StateProps>(GetInitialState());
  hookProps.state = state;
  hookProps.setState = setState;

  hookProps.registerMeter = {
    value: '',
    ref: React.createRef<TextInput>(),
  };
  hookProps.userNote = {
    value: '',
    ref: React.createRef<TextInput>(),
  };

  //console.log('hookState:', hookProps.state);
  return hookProps;
};

export const onInit = async navigation => {
  navigation.addListener('focus', async () => {
    const arrSei_ = await getArrSeri();
    setArrSeri(arrSei_);
  });
  navigation.addListener('blur', () => {
    //console.log('obBlur...');
    saveArrSeri(arrSeri);
  });
};
export const onDeInit = () => {
  saveArrSeri(arrSeri);
};
