import struct from '../../../util/cstruct';
import { Buffer } from 'buffer';
import { float, uint16_t, uint8_t } from '../../../util/custom_typedef';
import { Rtc_SimpleTimeProps, Rtc_SimpleTimeType } from '../RF/radioProtocol';

export enum OPTICAL_CMD {
  OPTICAL_START_SHAKE_HAND = 0,
  OPTICAL_END_SHAKE_HAND = 1,
  OPTICAL_ACK = 2,
  OPTICAL_GET_REGISTER = 3,
  OPTICAL_SET_REGISTER = 4,
  OPTICAL_CLEAR_REGISTER = 5,
  OPTICAL_START_AJUST = 6,
  OPTICAL_STOP_AJUST = 7,
  OPTICAL_SET_RTC = 8,
  OPTICAL_GET_RTC = 9,
  OPTICAL_SET_VERSION = 10,
  OPTICAL_GET_VERSION = 11,
  OPTICAL_SET_SERIAL = 12,
  OPTICAL_GET_SERIAL = 13,
  OPTICAL_SET_PARA = 14,
  OPTICAL_GET_PARA = 15,
  OPTICAL_CHANGE_PASSWORD = 16,
  OPTICAL_GET_ERROR_LC = 17,
  OPTICAL_GET_DELTA_LC = 18,
  OPTICAL_SET_RF_PARA = 19,
  OPTICAL_GET_RF_PARA = 20,
  OPTICAL_CLEAR_FRAM = 21,
  OPTICAL_RESET_PROGRAM = 22,
  OPTICAL_ADJUST_MOMENT = 23,
  OPTICAL_ADJUST_DELTA_LC = 24,
  OPTICAL_GET_STATUS_ADJUST = 25,
  OPTICAL_GET_MOMENT_LC = 26,
  OPTICAL_GET_MORE = 27,
  OPTICAL_GET_INFO_HHU = 28,
  OPTICAL_CLEAR_MOMENT = 29,
  OPTICAL_CLEAR_DELTA = 30,
  OPTICAL_GET_SENSOR_OBJ_INDIRECT_LC = 31,
  OPTICAL_SET_EVENT_CONFIG = 32,
  OPTICAL_GET_EVENT_CONFIG = 33,
  OPTICAL_GET_LIST_DATA_DAILY = 34,
  OPTICAL_CLEAR_LIST_DATA_DAILY = 35,
  OPTICAL_GET_LIST_DATA_MONTHLY = 36,
  OPTICAL_CLEAR_LIST_DATA_MONTHLY = 37,
  OPTICAL_GET_LIST_EVENT = 38,
  OPTICAL_CLEAR_LIST_EVENT = 39,
  OPTICAL_TEST_RF = 40,
  OPTICAL_GET_INFO_PROTOCOL = 41,
  OPTICAL_SET_INFO_PROTOCOL = 42,
  OPTICAL_REQUEST_SEND_DATA = 43,
  OPTICAL_SET_TIME_EXPORT = 44,
  OPTICAL_GET_TIME_EXPORT = 45,
  OPTICAL_GET_TIME_SEND = 46,
}

type TypeSensor = 'LC_METER' | '5l/1v' | '0.25l/v' | '0.5l/1v' | '1l/v';

export type Identity_SensorProps = {
  [key in TypeSensor]: {
    id: number;
    factor: number;
  };
};

export enum Optical_PasswordType {
  PW_TYPE_P1 = 0,
  PW_TYPE_P2,
  PW_TYPE_P3,
}

export enum OPTICAL_TYPE_GET_DATA_DAILY {
  TYPE_GET_BY_NEAREST = 1,
  TYPE_GET_BY_TIME = 2,
}

export const IdentitySensor: Identity_SensorProps = {
  LC_METER: {
    id: 1,
    factor: 1.0 / 6.0,
  },
  '5l/1v': {
    id: 2,
    factor: 5,
  },
  '0.25l/v': {
    id: 3,
    factor: 0.25,
  },
  '0.5l/1v': {
    id: 4,
    factor: 0.5,
  },
  '1l/v': {
    id: 5,
    factor: 1,
  },
};

export const Optical_HeaderType = struct(`
    uint8_t u8Command;
    uint8_t u8Length;
    uint8_t u8FSN;

`);

export type Optical_HeaderProps = {
  u8Command: uint8_t;
  u8Length: uint8_t;
  u8FSN: uint8_t;
};

export const Rtc_CalendarType = struct(`
  uint8_t u8Seconds;
  uint8_t u8Minutes;
  uint8_t u8Hours;
  uint8_t u8DayOfWeek;
  uint8_t u8DayOfMonth;
  uint8_t u8Month;
  uint16_t u16Year;

`);

export type Rtc_CalendarProps = {
  u8Seconds: uint8_t;
  u8Minutes: uint8_t;
  u8Hours: uint8_t;
  u8DayOfWeek: uint8_t;
  u8DayOfMonth: uint8_t;
  u8Month: uint8_t;
  u16Year: uint16_t;
};

export const Optical_MoreInfoType = struct(`
float fTemperature;
float fVoltage;

`);

export type Optical_MoreInfoProps = {
  fTemperature: float;
  fVoltage: float;
};

export const DataManager_IlluminateRecordType = struct`
    ${Rtc_SimpleTimeType} SimpleTime;
    uint8_t au8CwData[4];
    uint8_t au8UcwData[4];

`;

export type DataManager_IlluminateRecordProps = {
  SimpleTime: Rtc_SimpleTimeProps;
  au8CwData: Buffer;
  au8UcwData: Buffer;
};
