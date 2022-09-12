import React, { useContext, useState } from 'react';
import {
  getMeterSpeciesDropDownProps,
  PropsCheckBox,
  PropsDropdown,
  TYPE_METER,
} from '../../service/hhu/defineEM';
import { TypeReadRF } from '../../service/hhu/RF/RfFunc';
import { getArrSeri, saveArrSeri } from '../../service/storage';
import { PropsStore, storeContext } from '../../store/store';
import { arrSeri, setArrSeri } from './handleButton';

type StateProps = {
  status: string;
  requestStop: boolean;
  seri: string;
  typeRead: TypeReadRF;
  typeMeter: TYPE_METER;
  dataTable: RowTableProps;
  isReading: boolean;
  numberRetries: string;
  dateStart: Date;
  dateEnd: Date;
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
  new Set<TypeReadRF>(['Dữ liệu gần nhất', 'Theo thời gian']),
);

type HookProps = {
  state: StateProps;
  setState: React.Dispatch<React.SetStateAction<StateProps>>;
};

type RowTableProps = string[][]; //[[string, string]];

export const dataHeaderTable = ['Thông số', 'Giá trị'];

export const hookProps = {} as HookProps;
export let store = {} as PropsStore | null;

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
    typeRead: 'Dữ liệu gần nhất',
    dataTable: [
      ['Điện áp', '0 (V)'],
      ['Dữ liệu', '0 (lít)'],
    ],
    isReading: false,
    numberRetries: '1',
    dateStart: dateStart,
    dateEnd: dateEnd,
    typeMeter: 'Đồng hồ',
  };
}

export const GetHookProps = (): HookProps => {
  store = useContext(storeContext);
  const [state, setState] = useState<StateProps>(GetInitialState());
  hookProps.state = state;
  hookProps.setState = setState;
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
