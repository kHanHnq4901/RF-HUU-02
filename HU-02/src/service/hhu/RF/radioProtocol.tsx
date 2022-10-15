import struct from '../../../util/cstruct';
import {Buffer} from 'buffer';
import {uint16_t, uint8_t} from '../../../util/custom_typedef';

export const SIZE_SERIAL = 4;

export enum RP_TYPE_PACKET {
  RP_PACKET_TYPE_ACK = 0x00,
  RP_PACKET_TYPE_DATA = 0x01,
  RP_PACKET_TYPE_ALARM = 0x02,
  RP_PACKET_TYPE_GATEWAY_CONFIG = 0x03,

  RP_PACKET_TYPE_HHU_GET_ONE_DATA = 0x0a,
  RP_PACKET_TYPE_HHU_GET_ONE_DATA_0H = 0x0b,
  RP_PACKET_TYPE_HHU_GET_ALL_DATA = 0x0c,
  RP_PACKET_TYPE_HHU_GET_ALL_DATA_0H = 0x0d,
}

export enum RP_TYPE_HOST {
  DCU = 0,
  HHU = 1,
}

export enum TYPE_AFFECT {
  AFFECT_ONE = 0,
  AFFECT_ALL = 1,
}

export const Rtc_SimpleTimeType = struct(`
  uint8_t u8Year;
  uint8_t u8Month;
  uint8_t u8Date;
  uint8_t u8Hour;
  uint8_t u8Minute;
  uint8_t u8Second;

`);

export type Rtc_SimpleTimeProps = {
  u8Year: uint8_t;
  u8Month: uint8_t;
  u8Date: uint8_t;
  u8Hour: uint8_t;
  u8Minute: uint8_t;
  u8Second: uint8_t;
};

export const RP_HeaderType = struct`
  uint8_t u8TypePacket;
  ${Rtc_SimpleTimeType} Time;
  uint8_t u8TypeWM;
  uint8_t u8Version;
  uint8_t u8LengthPayload; 
  uint8_t au8Addr[${SIZE_SERIAL}];
`;

export type RP_HeaderProps = {
  u8TypePacket: uint8_t;
  Time: Rtc_SimpleTimeProps;
  u8TypeWM: uint8_t;
  u8Version: uint8_t;
  u8LengthPayload: uint8_t;
  au8Addr: Buffer;
};

export const RP_ConfigTimeType = struct(`
  uint8_t u8Hour;
  uint8_t u8Minute;
`);

export type RP_ConfigTimeProps = {
  u8Hour: uint8_t;
  u8Minute: uint8_t;
};

export const RP_HHUType = struct(`
  uint8_t u8StartDate;   
  uint8_t u8NumberActiveDay;
`);

export type RP_HHUProps = {
  u8StartDate: uint8_t;
  u8NumberActiveDay: uint8_t;
};

export const RP_ConfigNode2GatewayType = struct`
  uint16_t u16PeriodSend;       
  ${RP_ConfigTimeType} StartTime;  
  ${RP_ConfigTimeType} EndTime;    
  uint8_t u8NumberLatchPerDay;             
  ${RP_HHUType} HHUConfig;
`;

export type RP_ConfigNode2GatewayProps = {
  u16PeriodSend: uint16_t;
  StartTime: RP_ConfigTimeProps;
  EndTime: RP_ConfigTimeProps;
  u8NumberLatchPerDay: uint8_t;
  HHUConfig: RP_HeaderProps;
};

export const RP_RfConfigType = struct`
  uint8_t u8SF;
  uint8_t u8CodingRate;
  uint8_t u8PreambleLength;
`;

export type RP_RfConfigProps = {
  u8SF: uint8_t;
  u8CodingRate: uint8_t;
  u8PreambleLength: uint8_t;
};

export type RP_TransientProps = {
  u16UsedCapacity: uint16_t; // // Dung lượng pin đã sử dụng
  u8Temp: uint8_t; // Nhiệt độ
  u8Voltage: uint8_t; // Điện áp
  u8NumResets: uint8_t; // Số lần reset
  u16TimeSlot: uint16_t; // Khe thời gian

  u16NumSent2GateWay: uint16_t; // số lần gửi lên gateway
  //RadioConfig: RP_RfConfigProps; // cấu hình RF
};

export const RP_TransientType = struct`
  uint16_t u16UsedCapacity;
  uint8_t u8Temp; 
  uint8_t u8Voltage;
  uint8_t u8NumResets; 
  uint16_t u16TimeSlot;

  uint16_t u16NumSent2GateWay;
  
`;

// export type DataManager_IlluminateRecordProps = {
//   SimpleTime: Rtc_SimpleTimeProps;
//   au8CwData: Buffer;
//   au8UcwData: Buffer;
// };

// export const DataManager_IlluminateRecordType = struct`
//   ${Rtc_SimpleTimeType} SimpleTime;
//   uint8_t au8CwData[4];
//   uint8_t au8UcwData[4];
// `;

export const DataManager_DataType = struct`
  uint8_t au8CwData[4];
  uint8_t au8UcwData[4];
`;

export type DataManager_DataProps = {
  au8CwData: Buffer;
  au8UcwData: Buffer;
};

export const DataManager_IlluminateRecordProps = struct`
  ${Rtc_SimpleTimeType} SimpleTime;
  uint8_t au8CwData[4];
  uint8_t au8UcwData[4];
`;

export const RP_DataType = struct`
  ${DataManager_DataType} Data;
`;

export type RP_DataProps = {
  Data: DataManager_DataProps;
};

export const RP_TimeFirstDataType = struct` 
  uint8_t u8Year;
  uint8_t u8Month;
  uint8_t u8Date;
  uint8_t u8Hour;`;

export type RP_TimeFirstDataProps = {
  u8Year: uint8_t;
  u8Month: uint8_t;
  u8Date: uint8_t;
  u8Hour: uint8_t;
};
