import {dumyEntity, PropsAddMoreEntity, PropsKHCMISEntity} from '../entity';

type PropsCell = {
  id: keyof PropsTable;
};

type PropsTable = {
  seriModule: PropsCell;
  seriMeter: PropsCell;
  lineId: PropsCell;
  lineName: PropsCell;
  customerName: PropsCell;
  customerCode: PropsCell;
  phone: PropsCell;
  email: PropsCell;
  meterName: PropsCell;
  pointCodeMeasurement: PropsCell;
  address: PropsCell;
  dateCreated: PropsCell;
  dateQuery: PropsCell;
  data: PropsCell;
  stt: PropsCell;
  id: PropsCell;
  typeRead: PropsCell;
  isSent: PropsCell;
  note: PropsCell;
};

export const dataDBTable: PropsTable = {
  seriModule: {
    id: 'seriModule',
  },
  seriMeter: {
    id: 'seriMeter',
  },
  lineId: {
    id: 'lineId',
  },
  lineName: {
    id: 'lineName',
  },
  customerName: {
    id: 'customerName',
  },
  customerCode: {
    id: 'customerCode',
  },
  phone: {
    id: 'phone',
  },
  email: {
    id: 'email',
  },
  meterName: {
    id: 'meterName',
  },
  pointCodeMeasurement: {
    id: 'pointCodeMeasurement',
  },
  address: {
    id: 'address',
  },
  dateCreated: {
    id: 'dateCreated',
  },
  dateQuery: {
    id: 'dateQuery',
  },
  data: {
    id: 'data',
  },
  stt: {
    id: 'stt',
  },
  id: {
    id: 'id',
  },
  typeRead: {
    id: 'typeRead',
  },
  isSent: {
    id: 'isSent',
  },
  note: {
    id: 'note',
  },
};

export type PropsDataModel = {
  cwRegister: string;
  uCwRegister: string;
  time: string;
}[];

export type PropsKHCMISModel = {
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
  data: PropsDataModel;
  stt: number;
  id: string;
  typeRead: string;
  isSent: boolean | null;
  note: string;
};

const dumy: PropsKHCMISModel = {
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
  data: [],
  stt: 0,
  id: '',
  typeRead: '',
  isSent: false,
  note: '',
};

export type PropsTypeOf =
  | 'undefined'
  | 'object'
  | 'boolean'
  | 'number'
  | 'bigint'
  | 'string'
  | 'symbol'
  | 'function'
  | 'object';

export const getTypeOfColumn = (id: string): PropsTypeOf => {
  return typeof dumy[id];
};

export type PropsPercentRead = {
  readSucceed: number;
  haveNotRead: number;
  readFailed: number;
  writeByHand: number;
  abnormalRead: number;
};

const getFiledKHCMIS = (): string[] => {
  const fields: string[] = [];
  for (let i in dumy) {
    fields.push(i);
  }
  return fields;
};

export const KHCMISModelFields = getFiledKHCMIS();
