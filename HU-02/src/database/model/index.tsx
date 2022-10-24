import {dumyEntity, PropsAddMoreEntity, PropsKHCMISEntity} from '../entity';

type PropsCell = {
  id: keyof PropsTable;
};

type PropsTable = {
  NO_MODULE: PropsCell;
  NO_METER: PropsCell;
  LINE_ID: PropsCell;
  LINE_NAME: PropsCell;
  CUSTOMER_NAME: PropsCell;
  CUSTOMER_CODE: PropsCell;
  PHONE: PropsCell;
  EMAIL: PropsCell;
  METER_NAME: PropsCell;
  POINT_CODE_MEASUREMENT: PropsCell;
  ADDRESS: PropsCell;
  DATE_CREATED: PropsCell;
  DATE_QUERY: PropsCell;
  DATA: PropsCell;
  STT: PropsCell;
  ID: PropsCell;
  TYPE_READ: PropsCell;
  IS_SENT: PropsCell;
  NOTE: PropsCell;
};

export const dataDBTable: PropsTable = {
  NO_MODULE: {
    id: 'NO_MODULE',
  },
  NO_METER: {
    id: 'NO_METER',
  },
  LINE_ID: {
    id: 'LINE_ID',
  },
  LINE_NAME: {
    id: 'LINE_NAME',
  },
  CUSTOMER_NAME: {
    id: 'CUSTOMER_NAME',
  },
  CUSTOMER_CODE: {
    id: 'CUSTOMER_CODE',
  },
  PHONE: {
    id: 'PHONE',
  },
  EMAIL: {
    id: 'EMAIL',
  },
  METER_NAME: {
    id: 'METER_NAME',
  },
  POINT_CODE_MEASUREMENT: {
    id: 'POINT_CODE_MEASUREMENT',
  },
  ADDRESS: {
    id: 'ADDRESS',
  },
  DATE_CREATED: {
    id: 'DATE_CREATED',
  },
  DATE_QUERY: {
    id: 'DATE_QUERY',
  },
  DATA: {
    id: 'DATA',
  },
  STT: {
    id: 'STT',
  },
  ID: {
    id: 'ID',
  },
  TYPE_READ: {
    id: 'TYPE_READ',
  },
  IS_SENT: {
    id: 'IS_SENT',
  },
  NOTE: {
    id: 'NOTE',
  },
};

export type PropsDataModel = {
  cwRegister: number;
  uCwRegister: number;
  time: string;
}[];

export type PropsKHCMISModel = {
  NO_MODULE: string;
  NO_METER: string;
  LINE_ID: string;
  LINE_NAME: string;
  CUSTOMER_NAME: string;
  CUSTOMER_CODE: string;
  PHONE: string;
  EMAIL: string;
  METER_NAME: string;
  POINT_CODE_MEASUREMENT: string;
  ADDRESS: string;
  DATE_CREATED: string;
  DATE_QUERY: string;
  DATA: PropsDataModel;
  STT: number;
  ID: string;
  TYPE_READ: string;
  IS_SENT: boolean | null;
  NOTE: string;
};

const dumy: PropsKHCMISModel = {
  NO_MODULE: '',
  NO_METER: '',
  LINE_ID: '',
  LINE_NAME: '',
  CUSTOMER_NAME: '',
  CUSTOMER_CODE: '',
  PHONE: '',
  EMAIL: '',
  METER_NAME: '',
  POINT_CODE_MEASUREMENT: '',
  ADDRESS: '',
  DATE_CREATED: '',
  DATE_QUERY: '',
  DATA: [],
  STT: 0,
  ID: '',
  TYPE_READ: '',
  IS_SENT: false,
  NOTE: '',
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
