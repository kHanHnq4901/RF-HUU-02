import {PropsAddMeter} from '../../service/api';

export type PropsAddMoreEntity = {
  ID: string;
  IS_SENT: boolean | null;
};

export type PropsDeclareMeterEntity = PropsAddMeter & PropsAddMoreEntity;

export const TABLE_NAME = 'DECLARE_METER';

export const dumyEntity: PropsDeclareMeterEntity = {
  MeterNo: '',
  MeterName: '',
  MeterModelID: '',
  LineID: '',
  CustomerCode: '',
  CustomerName: '',
  CustomerAddress: '',
  CustomerPhone: '',
  SIM: '',
  Coordinate: '',
  ID: '',
  IS_SENT: false,
};
