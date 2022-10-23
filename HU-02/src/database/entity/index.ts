export type PropsAddMoreEntity = {
  stt: number;
  id: string;
  typeRead: string;
  isSent: boolean | null;
  note: string;
};

type PropsMeterModel = {
  seriModule: string;
  seriMeter: string;
  lineId: string;
  lineName: string;
  customerName: string;
  customerCode: string;
  phone: string;
  email: string;
  meterName: string;
  pointCodeMeasurement: string;
  address: string;
  dateCreated: string;
  dateQuery: string;
  data: string;
};

export type PropsKHCMISEntity = PropsMeterModel & PropsAddMoreEntity;

export const TABLE_NAME = 'KHCMIS';

export const dumyEntity: PropsKHCMISEntity = {
  seriModule: '',
  seriMeter: '',
  lineId: '',
  lineName: '',
  customerName: '',
  customerCode: '',
  phone: '',
  email: '',
  meterName: '',
  pointCodeMeasurement: '',
  address: '',
  dateCreated: '',
  dateQuery: '',
  data: '',
  stt: 0,
  id: '',
  typeRead: '',
  isSent: false,
  note: '',
};
