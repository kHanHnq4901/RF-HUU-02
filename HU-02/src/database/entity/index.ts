export type PropsAddMoreEntity = {
  stt: number;
  id: string;
  typeRead: string;
  isSent: string;
  note: string;
};

type PropsMeterModel = {
  seriModule: string;
  lineId: string;
  lineName: string;
  customerName: string;
  customerCode: string;
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
  lineId: '',
  lineName: '',
  customerName: '',
  customerCode: '',
  pointCodeMeasurement: '',
  address: '',
  dateCreated: '',
  dateQuery: '',
  data: '',
  stt: 0,
  id: '',
  typeRead: '',
  isSent: '',
  note: '',
};
