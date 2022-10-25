import {Buffer} from 'buffer';
import {aes_128_dec, aes_128_en} from '../../../util/aes128';
import {crc16_offset} from '../../../util/crc16';
import struct from '../../../util/cstruct';
import {int8_t, uint8_t} from '../../../util/custom_typedef';
import {HhuObj, TYPE_OBJ} from '../Ble/hhuFunc';
import {
  Array2Struct,
  sizeof,
  Struct2Array,
} from '../../../util/struct-and-array';
import {
  hhuFunc_wait,
  hhuFunc_HeaderProps,
  hhuFunc_Send,
  PropsResponse,
  TYPE_HHU_CMD,
} from '../Ble/hhuFunc';
import {
  RP_HhuHeaderProps,
  RP_HhuHeaderType,
  RP_HhuTime5byteProps,
  RP_HhuTime5byteType,
  RP_HhuTypeReadData,
} from './hhuProtocol';
import {
  DataManager_DataProps,
  RP_ConfigNode2GatewayProps,
  RP_ConfigNode2GatewayType,
  RP_DataProps,
  RP_DataType,
  RP_HeaderProps,
  RP_HeaderType,
  RP_TimeFirstDataProps,
  RP_TimeFirstDataType,
  RP_TransientProps,
  RP_TransientType,
  RP_TYPE_PACKET,
  SIZE_SERIAL,
} from './radioProtocol';
import {PropsLabel} from '../defineWM';
import {SimpleTimeToSTring} from '../util/utilFunc';

const TAG = 'Rf Func';

export type TypeReadRF = 'Dữ liệu gần nhất' | 'Theo thời gian';
export type TypeEfectRF = 'Đọc 1' | 'Đọc nhiều';

enum TYPE_EFFECT {
  TYPE_EFFECT_ONE = 0x01,
  TYPE_EFFECT_MANY = 0x02,
}

type HhuEncodeProps = {
  typePacket: RP_HhuTypeReadData;
  destAddr: string;
  is0h: boolean;
  dateStart?: Date;
  dateEnd?: Date;
  numNearest?: uint8_t;
};

type RecordDetailProps = {
  time: RP_TimeFirstDataProps;
  data: RP_DataProps;
};

type PropsResponseRadio = {
  header: RP_HeaderProps;
  //transient?: RP_TransientProps;
  timeLatchFirst: RP_TimeFirstDataProps;
  data: DataManager_DataProps[];
  detailedRecord: RecordDetailProps[];
  //configNode2Gateway?: RP_ConfigNode2GatewayProps;
};

export type PropsObjAnalysishRf = {
  infoGet: RfFunc_InfoGetProps;
  radio: PropsResponseRadio;
};

export const RfFunc_InfoGetType = struct(`
uint8_t au8Seri[${SIZE_SERIAL}];
uint8_t u8TypeEffect;
int8_t s8Rssi;
uint8_t u8TimeWor;

`);

export type RfFunc_InfoGetProps = {
  au8Seri: Buffer;
  u8TypeEffect: uint8_t;
  s8Rssi: int8_t;
  u8TimeWor: uint8_t;
};

export async function AnalysisRF(payload: Buffer): Promise<PropsResponse> {
  const response = {
    bSucceed: false,
    message: '',
    obj: {
      infoGet: {},
      radio: {},
    } as PropsObjAnalysishRf,
  } as PropsResponse;

  let index = 0;

  let responseRadio = {} as PropsResponseRadio;

  response.obj.infoGet = Array2Struct(payload, index, RfFunc_InfoGetType);
  index += sizeof(RfFunc_InfoGetType);

  let lengthPayloadRadio = payload.length - sizeof(RfFunc_InfoGetType);
  aes_128_dec(payload, index, Math.floor(lengthPayloadRadio / 16));
  responseRadio.header = Array2Struct(payload, index, RP_HeaderType);
  const crcRfCalculate = crc16_offset(
    payload,
    index,
    sizeof(RP_HeaderType) + responseRadio.header.u8LengthPayload,
  );
  const crcRfBuff = payload.readUIntLE(
    index + sizeof(RP_HeaderType) + responseRadio.header.u8LengthPayload,
    2,
  );

  if (crcRfCalculate !== crcRfBuff) {
    response.message = 'error crc user rf';
    response.bSucceed = false;
    console.error(TAG, 'error crc user rf');
    return response;
  }

  // calculate crc radio

  responseRadio.header.au8Addr = Buffer.from(responseRadio.header.au8Addr);

  index += sizeof(RP_HeaderType);
  let lengthForTimeAndData: number = 0;
  let numRecord: number = 0;

  switch (responseRadio.header.u8TypePacket) {
    case RP_TYPE_PACKET.RP_PACKET_TYPE_HHU_GET_ONE_DATA:
      responseRadio.data = [];
      responseRadio.detailedRecord = [];

      lengthForTimeAndData = responseRadio.header.u8LengthPayload;
      //  -
      // sizeof(RP_ConfigNode2GatewayType) -
      // sizeof(RP_TransientType);

      numRecord = 0;

      if (lengthForTimeAndData > sizeof(RP_TimeFirstDataType)) {
        numRecord =
          (lengthForTimeAndData - sizeof(RP_TimeFirstDataType)) /
          sizeof(RP_DataType);

        let timeFistData: RP_TimeFirstDataProps = Array2Struct(
          payload,
          index,
          RP_TimeFirstDataType,
        );

        responseRadio.timeLatchFirst = timeFistData;

        let dateTime = new Date();
        dateTime.setFullYear(timeFistData.u8Year + 2000);
        dateTime.setMonth(timeFistData.u8Month - 1);
        dateTime.setDate(timeFistData.u8Date);
        dateTime.setHours(timeFistData.u8Hour);
        dateTime.setMinutes(0);
        dateTime.setSeconds(0);

        index += sizeof(RP_TimeFirstDataType);

        console.log('timeFistData:', timeFistData);
        console.log('dateTime:', dateTime.toLocaleString());

        for (let k = 0; k < numRecord; k++) {
          let dataRP: RP_DataProps = Array2Struct(payload, index, RP_DataType);
          dataRP.Data.au8CwData = Buffer.from(dataRP.Data.au8CwData);
          dataRP.Data.au8UcwData = Buffer.from(dataRP.Data.au8UcwData);
          let time = {} as RP_TimeFirstDataProps;

          time.u8Year = dateTime.getFullYear() - 2000;
          time.u8Month = dateTime.getMonth() + 1;
          time.u8Date = dateTime.getDate();
          time.u8Hour = dateTime.getHours();
          let record: RecordDetailProps = {
            data: dataRP,
            time: time,
          };
          responseRadio.data.push(dataRP.Data);
          responseRadio.detailedRecord.push(record);
          index += sizeof(RP_DataType);

          dateTime.setHours(dateTime.getHours() - 1);
        }
      }

      if (numRecord < 0) {
        throw new Error('numRecord < 0');
      }

      // responseRadio.configNode2Gateway = Array2Struct(
      //   payload,
      //   index,
      //   RP_ConfigNode2GatewayType,
      // );

      index += sizeof(RP_ConfigNode2GatewayType);

      //responseRadio.transient = Array2Struct(payload, index, RP_TransientType);

      response.obj.radio = responseRadio;

      response.bSucceed = true;

      //console.log(TAG, JSON.stringify(response));

      break;
    case RP_TYPE_PACKET.RP_PACKET_TYPE_HHU_GET_ONE_DATA_0H:
      responseRadio.data = [];
      responseRadio.detailedRecord = [];

      lengthForTimeAndData = responseRadio.header.u8LengthPayload;

      numRecord = 0;

      if (lengthForTimeAndData > sizeof(RP_TimeFirstDataType)) {
        numRecord =
          (lengthForTimeAndData - sizeof(RP_TimeFirstDataType)) /
          sizeof(RP_DataType);

        let timeFistData: RP_TimeFirstDataProps = Array2Struct(
          payload,
          index,
          RP_TimeFirstDataType,
        );

        responseRadio.timeLatchFirst = timeFistData;

        let dateTime = new Date();
        dateTime.setFullYear(timeFistData.u8Year + 2000);
        dateTime.setMonth(timeFistData.u8Month - 1);
        dateTime.setDate(timeFistData.u8Date);
        dateTime.setHours(timeFistData.u8Hour);

        index += sizeof(RP_TimeFirstDataType);

        console.log('timeFistData:', timeFistData);
        console.log('dateTime:', dateTime.toLocaleString());

        for (let k = 0; k < numRecord; k++) {
          let dataRP: RP_DataProps = Array2Struct(payload, index, RP_DataType);
          dataRP.Data.au8CwData = Buffer.from(dataRP.Data.au8CwData);
          dataRP.Data.au8UcwData = Buffer.from(dataRP.Data.au8UcwData);
          let time = {} as RP_TimeFirstDataProps;

          time.u8Year = dateTime.getFullYear() - 2000;
          time.u8Month = dateTime.getMonth() + 1;
          time.u8Date = dateTime.getDate();
          time.u8Hour = dateTime.getHours();
          let record: RecordDetailProps = {
            data: dataRP,
            time: time,
          };
          responseRadio.data.push(dataRP.Data);
          responseRadio.detailedRecord.push(record);
          index += sizeof(RP_DataType);

          dateTime.setDate(dateTime.getDate() - 1);
        }
      }

      if (numRecord < 0) {
        throw new Error('numRecord < 0');
      }
      response.obj.radio = responseRadio;

      response.bSucceed = true;

      //console.log(TAG, JSON.stringify(response));

      break;
    case RP_TYPE_PACKET.RP_PACKET_TYPE_ACK:
      break;
    default:
      response.message = 'No type RP_TYPE_PACKET';
      response.bSucceed = false;
      console.error('No type RP_TYPE_PACKET');
      break;
  }

  return response;
}

export const RfFunc_EncodePayloadRadio = (
  props: HhuEncodeProps,
): Buffer | null => {
  const headerGetData = {} as RP_HhuHeaderProps;

  let index: number = 0;

  let addr: number = Number(props.destAddr);

  headerGetData.au8NoModule = Buffer.alloc(SIZE_SERIAL);

  headerGetData.au8NoModule.writeUintLE(addr, 0, SIZE_SERIAL);

  headerGetData.u8Cmd = props.typePacket & 0x7f;
  if (props.is0h === true) {
    headerGetData.u8Cmd |= (1 << 7) & 0xff;
  }

  switch (props.typePacket) {
    case RP_HhuTypeReadData.HHU_APS_CMD_READ_NEAREST_DATA:
      if (!props.numNearest) {
        return null;
      }
      headerGetData.u8Length = 1;
      break;
    case RP_HhuTypeReadData.HHU_APS_CMD_READ_DATA_BY_TIME:
      if (!props.dateStart || !props.dateEnd) {
        return null;
      }
      headerGetData.u8Length = sizeof(RP_HhuTime5byteType) * 2;
      break;
    default:
      return null;
  }

  index += sizeof(RP_HhuHeaderType);

  let lengthPayloadRadio =
    sizeof(RP_HhuHeaderType) + headerGetData.u8Length; /* crc16 */
  let num16Data = 0;

  num16Data = Math.ceil(lengthPayloadRadio / 16);

  const PayloadRadio = Buffer.alloc(num16Data * 16);

  // copy struct radioHeader to payload Radio buffer
  Struct2Array(RP_HhuHeaderType, headerGetData, PayloadRadio, 0);

  switch (props.typePacket) {
    case RP_HhuTypeReadData.HHU_APS_CMD_READ_NEAREST_DATA:
      PayloadRadio[index] = (props.numNearest ?? 0) & 0xff;
      break;
    case RP_HhuTypeReadData.HHU_APS_CMD_READ_DATA_BY_TIME:
      headerGetData.u8Length = sizeof(RP_HhuTime5byteType) * 2;
      let startTime = {} as RP_HhuTime5byteProps;
      let endTime = {} as RP_HhuTime5byteProps;

      startTime.u8Year = (props.dateStart?.getFullYear() ?? 2000) - 2000;
      startTime.u8Month = (props.dateStart?.getMonth() ?? 0) + 1;
      startTime.u8Date = props.dateStart?.getDate() ?? 0;
      startTime.u8Hour = props.dateStart?.getHours() ?? 0;
      startTime.u8Minute = props.dateStart?.getMinutes() ?? 0;

      Struct2Array(RP_HhuTime5byteType, startTime, PayloadRadio, index);
      index += sizeof(RP_HhuTime5byteType);

      endTime.u8Year = (props.dateEnd?.getFullYear() ?? 2000) - 2000;
      endTime.u8Month = (props.dateEnd?.getMonth() ?? 0) + 1;
      endTime.u8Date = props.dateEnd?.getDate() ?? 0;
      endTime.u8Hour = props.dateEnd?.getHours() ?? 0;
      endTime.u8Minute = props.dateEnd?.getMinutes() ?? 0;

      Struct2Array(RP_HhuTime5byteType, endTime, PayloadRadio, index);
      index += sizeof(RP_HhuTime5byteType);

      // console.log('start time:', startTime);
      // console.log('end time:', endTime);

      break;
    default:
      return null;
  }

  // console.log(TAG, 'payload radio before encode: ');
  // console.log(PayloadRadio);
  // encode aes128

  aes_128_en(PayloadRadio, 0, num16Data);

  // console.log(TAG, 'payload radio after encode: ');
  // console.log(PayloadRadio);

  // let buff = Buffer.from(PayloadRadio);
  // aes_128_dec(buff, num16Data);
  // console.log(TAG, 'buff decode: ');
  // console.log(buff);

  return PayloadRadio;
};

type PropsRead = {
  seri: string;
  typeRead: TypeReadRF;
  typeAffect: TypeEfectRF;
  is0h: boolean;
  numNearest?: number;
  dateStatrt?: Date;
  dateEnd?: Date;
};

export type PropsModelRadio = {
  info: {[key in PropsLabel]: string};
  data: {
    [key in PropsLabel]?: string;
  }[];
};

export async function RfFunc_Read(props: PropsRead): Promise<PropsResponse> {
  console.log(TAG, props);

  let response = {} as PropsResponse;
  response.bSucceed = false;
  response.message = '';

  let payloadRadio = RfFunc_EncodePayloadRadio({
    destAddr:
      props.typeAffect === 'Đọc 1' ? props.seri : (0xffffffff).toString(),
    typePacket:
      props.typeRead === 'Dữ liệu gần nhất'
        ? RP_HhuTypeReadData.HHU_APS_CMD_READ_NEAREST_DATA
        : RP_HhuTypeReadData.HHU_APS_CMD_READ_DATA_BY_TIME,
    is0h: props.is0h,
    dateEnd: props.dateEnd,
    dateStart: props.dateStatrt,
    numNearest: props.numNearest,
  });

  if (payloadRadio) {
    const headerGet: RfFunc_InfoGetProps = {
      au8Seri: Buffer.alloc(SIZE_SERIAL),
      s8Rssi: 0,
      u8TimeWor: 6,
      u8TypeEffect:
        props.typeAffect === 'Đọc 1'
          ? TYPE_EFFECT.TYPE_EFFECT_ONE
          : TYPE_EFFECT.TYPE_EFFECT_MANY,
    };

    headerGet.au8Seri.writeUintLE(Number(props.seri), 0, SIZE_SERIAL);

    const header = {} as hhuFunc_HeaderProps;

    let payload = Buffer.alloc(
      1 /*  type object*/ +
        sizeof(RfFunc_InfoGetType) +
        payloadRadio.byteLength,
    );

    let index = 0;

    payload[index] = TYPE_OBJ.OBJ_RF;
    index++;

    Struct2Array(RfFunc_InfoGetType, headerGet, payload, index);

    index += sizeof(RfFunc_InfoGetType);

    payloadRadio.copy(payload, index, 0);

    index += payloadRadio.byteLength;

    header.u16FSN = 0xffff;
    header.u16Length = payload.byteLength;
    header.u8Cmd = TYPE_HHU_CMD.DATA;

    let bResult = await hhuFunc_Send(header, payload);

    const modelRadio = {
      info: {},
      data: [],
    } as unknown as PropsModelRadio;

    if (bResult) {
      do {
        let responseHHU = await hhuFunc_wait(headerGet.u8TimeWor * 1000 + 2000);

        if (responseHHU.bSucceed) {
          const headerHHu = responseHHU.obj.hhuHeader as hhuFunc_HeaderProps;

          let obj = HhuObj.buffRx[0];
          if (obj === TYPE_OBJ.OBJ_RF) {
            HhuObj.buffRx.copyWithin(0, 1);
            HhuObj.countRec = HhuObj.countRec - 1 /*obj */ - 2;

            payload = Buffer.alloc(HhuObj.countRec);
            HhuObj.buffRx.copy(payload, 0, 0, HhuObj.countRec);

            const responseRadio = await AnalysisRF(payload);

            if (responseRadio.bSucceed) {
              const dataRadio = responseRadio.obj as PropsObjAnalysishRf;

              modelRadio.info.Seri = dataRadio.radio.header.au8Addr
                .readUintLE(0, SIZE_SERIAL)
                .toString();

              if (modelRadio.info.Seri !== props.seri) {
                console.log('not match seri');
                console.log('target seri:' + props.seri);
                console.log('received seri:' + modelRadio.info.Seri);
                continue;
              }

              modelRadio.info.Rssi = dataRadio.infoGet.s8Rssi.toString();

              // if (dataRadio.radio.transient) {
              //   modelRadio.info['Điện áp'] = (
              //     dataRadio.radio.transient.u8Voltage / 40
              //   ).toFixed(2);
              // }

              const rtcSimpleTime = dataRadio.radio.header.Time;

              modelRadio.info['Thời gian'] = SimpleTimeToSTring(rtcSimpleTime);

              modelRadio.info['Phiên bản'] =
                dataRadio.radio.header.u8Version.toString();

              dataRadio.radio.detailedRecord.forEach(item => {
                const timeString =
                  item.time.u8Hour.toString().padStart(2, '0') +
                  'h  ' +
                  (item.time.u8Year + 2000).toString() +
                  '/' +
                  item.time.u8Month.toString().padStart(2, '0') +
                  '/' +
                  item.time.u8Date.toString().padStart(2, '0');

                const date = new Date();
                date.setFullYear(item.time.u8Year + 2000);
                if (item.time.u8Month < 1) {
                  response.message = 'item.time.u8Month < 1';
                  response.bSucceed = false;
                  return response;
                }
                date.setMonth(item.time.u8Month - 1);
                date.setDate(item.time.u8Date);
                date.setHours(item.time.u8Hour);
                date.setMinutes(0);
                date.setSeconds(0);

                modelRadio.data.push({
                  'Thời điểm chốt': timeString,
                  Xuôi: item.data.Data.au8CwData.readUintLE(0, 4).toString(),
                  Ngược: item.data.Data.au8UcwData.readUintLE(0, 4).toString(),
                  'Thời điểm chốt (full time)': date
                    .toISOString()
                    .split('.')[0]
                    .replace('T', ' '),
                });
              });

              response.obj = modelRadio;
              response.bSucceed = true;

              if (headerHHu.u16FSN === 0xffff) {
                modelRadio.info['Số bản tin chốt'] =
                  modelRadio.data.length.toString();
                return response;
              } else {
                console.log('FSN:', headerHHu.u16FSN);
              }
            } else {
              response.bSucceed = false;
              response.message = responseRadio.message;
              return response;
            }
          } else {
            response.bSucceed = false;
            response.message = 'Obj không hợp lệ';
            return response;
          }
        } else {
          response.bSucceed = false;
          response.message = responseHHU.message;
          return response;
        }
      } while (1);
    }
  } else {
    response.bSucceed = false;
    response.message = 'Lỗi Encode Bufer Radio';
    return response;
  }

  return response;
}
