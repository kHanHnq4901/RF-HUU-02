import struct from '../../../util/cstruct';
import {Buffer} from 'buffer';
import {uint16_t, uint8_t} from '../../../util/custom_typedef';
import {SIZE_SERIAL} from './radioProtocol';

export enum RP_HhuTypeReadData {
  HHU_APS_CMD_READ_NEAREST_DATA = 0x01,
  HHU_APS_CMD_READ_DATA_BY_TIME = 0x02,
}

export const RP_HhuTime5byteType = struct(`
  uint8_t u8Year;
  uint8_t u8Month;
  uint8_t u8Date;
  uint8_t u8Hour;
  uint8_t u8Minute;

`);

export type RP_HhuTime5byteProps = {
  u8Year: uint8_t;
  u8Month: uint8_t;
  u8Date: uint8_t;
  u8Hour: uint8_t;
  u8Minute: uint8_t;
};
//////////////////////////////////////////
export const RP_HhuHeaderType = struct(`
uint8_t au8NoModule[${SIZE_SERIAL}];
uint8_t u8Cmd;
uint8_t u8Length;

`);

export type RP_HhuHeaderProps = {
  au8NoModule: Buffer;
  u8Cmd: uint8_t;
  u8Length: number;
};

///////////////////////////////////////////////
