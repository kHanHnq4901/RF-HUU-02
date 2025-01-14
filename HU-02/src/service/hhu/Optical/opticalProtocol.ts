import struct from '../../../util/cstruct';
import { Buffer } from 'buffer';
import {
  float,
  int8_t,
  uint16_t,
  uint32_t,
  uint8_t,
} from '../../../util/custom_typedef';
import { Rtc_SimpleTimeProps, Rtc_SimpleTimeType } from '../RF/radioProtocol';

export enum OPTICAL_CMD {
  OPTICAL_START_SHAKE_HAND = 0 /** @brief command optical */,
  OPTICAL_END_SHAKE_HAND = 1 /** @brief command optical */,
  OPTICAL_ACK = 2 /** @brief command optical */,
  OPTICAL_GET_REGISTER = 3 /** @brief command optical */,
  OPTICAL_SET_REGISTER = 4 /** @brief command optical */,
  OPTICAL_CLEAR_REGISTER = 5 /** @brief command optical */,
  OPTICAL_START_AJUST = 6 /** @brief command optical */,
  OPTICAL_STOP_AJUST = 7 /** @brief command optical */,
  OPTICAL_SET_RTC = 8 /** @brief command optical */,
  OPTICAL_GET_RTC = 9 /** @brief command optical */,
  OPTICAL_SET_VERSION = 10 /** @brief command optical */,
  OPTICAL_GET_VERSION = 11 /** @brief command optical */,
  OPTICAL_SET_SERIAL = 12 /** @brief command optical */,
  OPTICAL_GET_SERIAL = 13 /** @brief command optical */,
  OPTICAL_SET_PARA = 14 /** @brief command optical */,
  OPTICAL_GET_PARA = 15 /** @brief command optical */,
  OPTICAL_CHANGE_PASSWORD = 16 /** @brief command optical */,
  OPTICAL_GET_ERROR_SYSTEM = 17 /** @brief command optical */,
  OPTICAL_GET_DELTA_LC = 18 /** @brief command optical */,
  OPTICAL_SET_RF_PARA = 19 /** @brief command optical */,
  OPTICAL_GET_RF_PARA = 20 /** @brief command optical */,
  OPTICAL_CLEAR_FRAM = 21 /** @brief command optical */,
  OPTICAL_RESET_PROGRAM = 22 /** @brief command optical */,
  OPTICAL_ADJUST_MOMENT = 23 /** @brief command optical */,
  OPTICAL_ADJUST_DELTA_LC = 24 /** @brief command optical */,
  OPTICAL_GET_STATUS_ADJUST = 25 /** @brief command optical */,
  OPTICAL_GET_MOMENT_LC = 26 /** @brief command optical */,
  OPTICAL_GET_MORE = 27 /** @brief command optical */,
  OPTICAL_GET_INFO_HHU = 28 /** @brief command optical */,
  OPTICAL_CLEAR_MOMENT = 29 /** @brief command optical */,
  OPTICAL_CLEAR_DELTA = 30 /** @brief command optical */,
  OPTICAL_GET_SENSOR_OBJ_INDIRECT_LC = 31 /** @brief command optical */,
  OPTICAL_SET_EVENT_CONFIG = 32 /** @brief command optical */,
  OPTICAL_GET_EVENT_CONFIG = 33 /** @brief command optical */,
  OPTICAL_GET_LIST_DATA_DAILY = 34 /** @brief command optical */,
  OPTICAL_CLEAR_LIST_DATA_DAILY = 35 /** @brief command optical */,
  OPTICAL_GET_LIST_DATA_MONTHLY = 36 /** @brief command optical */,
  OPTICAL_CLEAR_LIST_DATA_MONTHLY = 37 /** @brief command optical */,
  OPTICAL_GET_LIST_EVENT = 38 /** @brief command optical */,
  OPTICAL_CLEAR_LIST_EVENT = 39 /** @brief command optical */,
  OPTICAL_TEST_RF = 40 /** @brief command optical */,
  OPTICAL_GET_INFO_PROTOCOL = 41 /** @brief command optical */,
  OPTICAL_SET_INFO_PROTOCOL = 42 /** @brief command optical */,
  OPTICAL_REQUEST_SEND_DATA = 43 /** @brief command optical */,
  OPTICAL_SET_INFO_BATTERY = 44 /** @brief command optical */,
  OPTICAL_GET_INFO_BATTERy = 45 /** @brief command optical */,
  OPTICAL_GET_TIME_SEND = 46 /** @brief command optical */,
  OPTICAL_GET_CONFIG_SEND_DATA = 47 /** @brief command optical */,
  OPTICAL_SET_CONFIG_SEND_DATA = 48 /** @brief command optical */,
  OPTICAL_GET_TIME_LATCH_DATA = 49 /** @brief command optical */,
  OPTICAL_SET_TIME_LATCH_DATA = 50 /** @brief command optical */,
  OPTICAL_SET_DATA_NO_FACTOR_PULSE = 51 /** @brief command optical */,
  OPTICAL_RESET_PASSWORD_P1_P2 = 52 /** @brief command optical */,
  OPTICAL_CLEAR_CALIB_SENSOR = 53 /** @brief command optical */,
  OPTICAL_GET_DATA_NO_FACTOR_PULSE = 54 /** @brief command optical */,
  OPTICAL_GET_REGISTER_CW_UCW = 55 /** @brief command optical */,
  OPTICAL_SET_KEY_AES_RADIO = 56 /** @brief command optical */,
  OPTICAL_GET_KEY_AES_RADIO = 57 /** @brief command optical */,
  OPTICAL_SET_KEY_AES_OPTICAL = 58 /** @brief command optical */,
  OPTICAL_GET_KEY_AES_OPTICAL = 59 /** @brief command optical */,
  OPTICAL_SET_DEBUG = 60 /** @brief command optical */,
  OPTICAL_DEBUG_MESSAGE_FROM_NODE = 61 /** @brief command optical */,
  OPTICAL_SET_ACTIVE_RADIO = 62 /** @brief command optical */,
  OPTICAL_GET_ACTIVE_RADIO = 63 /** @brief command optical */,
}

export enum Optical_SeriType {
  OPTICAL_TYPE_SERI_MODULE = 1,
  OPTICAL_TYPE_SERI_METER = 2,
}

type TypeSensor =
  | 'LC_METER'
  | '5l/1v'
  | '0.25l/v'
  | '0.5l/1v'
  | '1l/v'
  | 'LC_METER_DN32';

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
  LC_METER_DN32: {
    id: 6,
    factor: 10.0 / 6.0,
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

export const Sensor_NvmErrorType = struct`
    uint32_t u32Increase;
    uint32_t u32Decrease;
    uint32_t u32NumReset;
    uint32_t u32PositionUserReset;
    uint16_t u16ResetState;
    uint8_t u8ResetStateByUser;
`;

export type Sensor_NvmErrorProps = {
  u32Increase: uint32_t;
  u32Decrease: uint32_t;
  u32NumReset: uint32_t;
  u32PositionUserReset: uint32_t;
  u16ResetState: uint16_t;
  u8ResetStateByUser: uint8_t;
  u16Crc: uint16_t;
};

const Optical_SubSensorType = struct`
    uint8_t u8Max;        
    uint8_t u8Min;        
    uint8_t u8CenterLine; 
`;

type Optical_SubSensorProps = {
  u8Max: uint8_t;
  u8Min: uint8_t;
  u8CenterLine: uint8_t;
};

/**
 * @brief          struct info of 3 sensor
 */
export const Optical_SensorInfoType = struct`
    ${Optical_SubSensorType} sensor[3];
`;

export type Optical_SensorInfoProps = {
  sensor: Optical_SubSensorProps[];
};

export const Optical_TimeRtcType = struct`
    uint8_t u8Year;
    uint8_t u8Month;
    uint8_t u8Date;
    uint8_t u8Hour;
    uint8_t u8Minute;
    uint8_t u8Sec;
`;

export type Optical_TimeRtcProps = {
  u8Year: uint8_t;
  u8Month: uint8_t;
  u8Date: uint8_t;
  u8Hour: uint8_t;
  u8Minute: uint8_t;
  u8Sec: uint8_t;
};

export const Optical_TimeSendType = struct`
    ${Optical_TimeRtcType} next;
    ${Optical_TimeRtcType} last;
    ${Optical_TimeRtcType} lastSucceed;
    uint8_t u8State;
`;

export type Optical_TimeSendProps = {
  next: Optical_TimeRtcProps;
  last: Optical_TimeRtcProps;
  lastSucceed: Optical_TimeRtcProps;
  u8State: uint8_t;
};

export const Optical_TestRFType = struct`
    uint8_t au8Serial[4];
    uint8_t u8Succeed;
    int8_t s8RssiGatewayRec;
    int8_t s8RssiSlaveRec;
    uint8_t u8HasIP;
    uint8_t au8Qccid[30];
    uint8_t au8Apn[20];
    uint8_t au8IMSI[20];
`;

export type Optical_TestRFProps = {
  au8Serial: Uint8Array;
  u8Succeed: uint8_t;
  s8RssiGatewayRec: int8_t;
  s8RssiSlaveRec: int8_t;
  u8HasIP: uint8_t;
  au8Qccid: Uint8Array;
  au8Apn: Uint8Array;
  au8IMSI: Uint8Array;
};
export const OPTICAL_CMD_INFO_PROTOCOL = {
  OPTION_HOST_PORT_INFO_RP: 0,
  OPTION_USER_PASSWORD_TOPIC_RP: 1,
};

export const SIZE_HOST = 36;
export const Optical_HostPortType = struct`
    uint8_t au8Host[${SIZE_HOST}];
    uint16_t u16Port;
`;

export type Optical_HostPortProps = {
  au8Host: Uint8Array;
  u16Port: uint16_t;
};
