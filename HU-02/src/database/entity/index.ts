export type PropsAddMoreEntity = {
  STT: number;
  ID: string;
  TYPE_READ: string;
  IS_SENT: boolean | null;
  NOTE: string;
};

type PropsMeterModel = {
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
  DATA: string;
};

export type PropsKHCMISEntity = PropsMeterModel & PropsAddMoreEntity;

export const TABLE_NAME = 'KHCMIS';

export const dumyEntity: PropsKHCMISEntity = {
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
  DATA: '',
  STT: 0,
  ID: '',
  TYPE_READ: '',
  IS_SENT: false,
  NOTE: '',
};
