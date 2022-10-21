import {PropsAddMoreEntity} from '../entity';

type PropsCell = {
  id: keyof PropsTable;
};

type PropsTable = {
  seriModule: PropsCell;
  lineId: PropsCell;
  lineName: PropsCell;
  customerName: PropsCell;
  customerCode: PropsCell;
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
  lineId: string;
  lineName: string;
  customerName: string;
  customerCode: string;
  pointCodeMeasurement: string;
  address: string;
  dateCreated: string;
  dateQuery: string;
  data: PropsDataModel;
} & PropsAddMoreEntity;

const dumy: PropsKHCMISModel = {
  seriModule: '',
  lineId: '',
  lineName: '',
  customerName: '',
  customerCode: '',
  pointCodeMeasurement: '',
  address: '',
  dateCreated: '',
  dateQuery: '',
  data: [],
  stt: 0,
  id: '',
  typeRead: '',
  isSent: '',
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
