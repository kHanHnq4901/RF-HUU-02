import {Buffer} from 'buffer';
import {crc16} from '../../../util/crc16';
import {
  sizeof,
  Struct2Array,
  Array2Struct,
} from '../../../util/struct-and-array';
import {BufferToString} from '../../../util';
import {
  hhuFunc_HeaderProps,
  hhuFunc_PropsObjAnalysis,
  hhuFunc_Send,
  hhuFunc_wait,
  PropsResponse,
  TYPE_HHU_CMD,
  TYPE_OBJ,
} from '../Ble/hhuFunc';
import {
  Rtc_SimpleTimeProps,
  Rtc_SimpleTimeType,
  SIZE_SERIAL,
} from '../RF/radioProtocol';
import {formatDateTimeDB, SimpleTimeToSTring} from '../util/utilFunc';
import {
  DataManager_IlluminateRecordProps,
  DataManager_IlluminateRecordType,
  IdentitySensor,
  Identity_SensorProps,
  OPTICAL_CMD,
  Optical_HeaderProps,
  Optical_HeaderType,
  Optical_MoreInfoProps,
  Optical_MoreInfoType,
  Optical_PasswordType,
  Optical_SeriType,
} from './opticalProtocol';

const TAG = 'opticalFunc:';

const OPTICAL_SIZE_PASS = 8;

export type FieldOpticalResponseProps =
  | 'Seri đồng hồ'
  | 'Seri module'
  | 'RTC'
  | 'Version'
  | 'Điện áp'
  | 'Dữ liệu'
  | 'Dữ liệu hàng ngày';

export type OpticalDailyProps = {
  'Thời điểm chốt': string;
  'Dữ liệu xuôi': string;
  'Dữ liệu ngược': string;
  'Chỉ số': string;
  'Thời điểm chốt(full time)': string;
};

async function opticalSendAck(): Promise<boolean> {
  const header = {} as Optical_HeaderProps;

  header.u8Command = OPTICAL_CMD.OPTICAL_ACK;
  header.u8Length = 0;
  header.u8FSN = 0xff;

  let bRet = await opticalSend(header);
  if (!bRet) {
    return false;
  }

  return true;
}

export async function opticalShakeHand(password: string): Promise<boolean> {
  if (password.length > 8) {
    console.log('password is too length');
    return false;
  }
  const header = {} as Optical_HeaderProps;
  let index = 0;
  const buffPass = Buffer.from(password);
  const payload = Buffer.alloc(1 /* type password */ + OPTICAL_SIZE_PASS);
  payload[index] = Optical_PasswordType.PW_TYPE_P1;
  index++;
  buffPass.copy(payload, index, 0, buffPass.byteLength);

  header.u8Command = OPTICAL_CMD.OPTICAL_START_SHAKE_HAND;
  header.u8Length = payload.byteLength;
  header.u8FSN = 0xff;

  let bRet = await opticalSend(header, payload);
  if (!bRet) {
    return false;
  }

  const response = await waitOptical(2000);
  if (!response.bSucceed) {
    console.log(TAG, response.message);
    return false;
  }
  return true;
}

function encodeIdentityOptical(payload: Buffer): Buffer {
  const newPayload = Buffer.alloc(5 + payload.byteLength);
  let index = 0;
  newPayload[index] = 0xfe;
  index++;
  newPayload[index] = 0xfe;
  index++;
  newPayload.writeUIntLE(payload.byteLength, index, 2);
  index += 2;
  newPayload[index] = (newPayload[2] + newPayload[3]) & 0xff;
  index++;
  payload.copy(newPayload, index, 0, payload.byteLength);

  return newPayload;
}

function encodeOptical(
  header: Optical_HeaderProps,
  payload?: Buffer,
): Buffer | null {
  if (header.u8Length > 0) {
    if (!payload) {
      return null;
    }
  }
  let index = 0;
  const lengthPayloadOptical =
    sizeof(Optical_HeaderType) + header.u8Length + 2; /* crc */
  const payloadOptical = Buffer.alloc(lengthPayloadOptical);
  Struct2Array(Optical_HeaderType, header, payloadOptical, 0);
  index += sizeof(Optical_HeaderType);
  if (payload && header.u8Length > 0) {
    payload.copy(payloadOptical, index, 0, header.u8Length);
    index += header.u8Length;
  }
  const crc = crc16(payloadOptical, index);
  payloadOptical.writeUintLE(crc, index, 2);
  index += 2;

  return encodeIdentityOptical(payloadOptical);
}

export async function opticalSend(
  header: Optical_HeaderProps,
  payload?: Buffer,
): Promise<boolean> {
  const payloadOptical = encodeOptical(header, payload);
  if (!payloadOptical) {
    return false;
  }

  const headerHhu: hhuFunc_HeaderProps = {
    u8Cmd: TYPE_HHU_CMD.DATA,
    u16FSN: 0xffff,
    u16Length: 1 /* obj*/ + payloadOptical.byteLength,
  };

  let index = 0;
  const hhuPayload = Buffer.alloc(1 + payloadOptical.byteLength);
  hhuPayload[0] = TYPE_OBJ.OBJ_OPTICAL;
  index++;
  payloadOptical.copy(hhuPayload, index, 0, payloadOptical.byteLength);
  return await hhuFunc_Send(headerHhu, hhuPayload);
}

type ObjResponseOpticalProps = {
  header: Optical_HeaderProps;
  payload: Buffer;
};

export async function AnalysisHhuOptical(
  payload: Buffer,
): Promise<PropsResponse> {
  //let lengthUartReceive = 0;
  const response = {} as PropsResponse;
  response.bSucceed = false;
  response.message = '';

  let index = 0;
  const typeObj = payload[index];
  if (typeObj !== TYPE_OBJ.OBJ_OPTICAL) {
    response.bSucceed = false;
    response.message = 'Not optical';
    return response;
  }

  index++;
  if (payload[index] !== 0xfe && payload[index + 1] !== 0xfe) {
    response.bSucceed = false;
    response.message = 'wrong identity';
    return response;
  }
  index += 2; /* fe fe */

  //   lengthUartReceive = payload.readUintLE(index, 2);
  index += 2; /* length 2 byte */

  if (payload[index] !== (0xff & (payload[index - 2] + payload[index - 1]))) {
    response.bSucceed = false;
    response.message = 'crc identity';
    return response;
  }

  index += 1;

  //payload.copyWithin(0, index, payload.byteLength - index);

  const headerOptical: Optical_HeaderProps = Array2Struct(
    payload,
    index,
    Optical_HeaderType,
  );

  index += sizeof(Optical_HeaderType);

  response.bSucceed = true;
  response.obj = {} as ObjResponseOpticalProps;
  response.obj.header = headerOptical;

  // const newPayload = Buffer.alloc(headerOptical.u8Length);
  // payload.copy(newPayload, 0, index, headerOptical.u8Length);

  response.obj.payload = payload.slice(index, index + headerOptical.u8Length);

  return response;
}

export async function waitOptical(timeout: number): Promise<PropsResponse> {
  const response = {} as PropsResponse;
  response.bSucceed = false;
  const responseHhuFunc = await hhuFunc_wait(timeout);
  if (responseHhuFunc.bSucceed !== true) {
    response.bSucceed = false;
    response.message = responseHhuFunc.message;
    return response;
  }

  const headerHhuFunc = (responseHhuFunc.obj as hhuFunc_PropsObjAnalysis)
    .hhuHeader;
  const payloadHhuFunc = (responseHhuFunc.obj as hhuFunc_PropsObjAnalysis)
    .payload;

  if (headerHhuFunc.u8Cmd !== TYPE_HHU_CMD.DATA) {
    response.bSucceed = false;
    response.message = 'Optical not reac a frame DATA';
    return response;
  }

  const responseHhuOptical = await AnalysisHhuOptical(payloadHhuFunc);

  return responseHhuOptical;
}

type PropsOpticalRecAdvance = {
  timeout: number;
  desiredCmd: OPTICAL_CMD;
  //data: any;
};

export async function waitOpticalAdvance(
  props: PropsOpticalRecAdvance,
): Promise<PropsResponse> {
  const response = {} as PropsResponse;

  response.bSucceed = false;

  const data = {} as {
    [key in FieldOpticalResponseProps]: string | OpticalDailyProps[];
  };

  const dataDaily = [] as OpticalDailyProps[];

  do {
    let index = 0;

    const responseOptical = await waitOptical(props.timeout);
    if (responseOptical.bSucceed !== true) {
      if (props.desiredCmd === OPTICAL_CMD.OPTICAL_GET_LIST_DATA_DAILY) {
        data['Dữ liệu hàng ngày'] = dataDaily;
      }
      response.bSucceed = false;
      response.obj = data;
      response.message = 'Quá thời gian';
      return response;
    }

    const objOptical: ObjResponseOpticalProps = responseOptical.obj;
    if (objOptical.header.u8Command !== props.desiredCmd) {
      responseOptical.bSucceed = false;
      responseOptical.message = `Not match command. Desied ${props.desiredCmd}, real: ${objOptical.header.u8Command}`;
      return responseOptical;
    }

    if (
      objOptical.header.u8Command === OPTICAL_CMD.OPTICAL_GET_LIST_DATA_DAILY
    ) {
      if (objOptical.header.u8FSN === 0) {
        dataDaily.length = 0;
      }
    }
    console.log('objOptical.header:', objOptical.header);
    console.log('objOptical.payload:', objOptical.payload);

    switch (objOptical.header.u8Command) {
      case OPTICAL_CMD.OPTICAL_ACK:
        break;
      case OPTICAL_CMD.OPTICAL_GET_SERIAL:
        let typeSeri = objOptical.payload[index];
        index++;
        if (
          typeSeri !== Optical_SeriType.OPTICAL_TYPE_SERI_METER &&
          typeSeri !== Optical_SeriType.OPTICAL_TYPE_SERI_MODULE
        ) {
          responseOptical.bSucceed = false;
          responseOptical.message = 'Incompatible type seri';
          return responseOptical;
        }
        if (typeSeri === Optical_SeriType.OPTICAL_TYPE_SERI_METER) {
          data['Seri đồng hồ'] = objOptical.payload
            .readUintLE(index, SIZE_SERIAL)
            .toString();
        }
        if (typeSeri === Optical_SeriType.OPTICAL_TYPE_SERI_MODULE) {
          data['Seri module'] = objOptical.payload
            .readUintLE(index, SIZE_SERIAL)
            .toString();
        }

        break;
      case OPTICAL_CMD.OPTICAL_GET_VERSION:
        data.Version = objOptical.payload[index].toString();
        break;
      case OPTICAL_CMD.OPTICAL_GET_MORE:
        const more: Optical_MoreInfoProps = Array2Struct(
          objOptical.payload,
          index,
          Optical_MoreInfoType,
        );
        data['Điện áp'] = more.fVoltage.toFixed(2);
        break;
      case OPTICAL_CMD.OPTICAL_GET_RTC:
        const rtc: Rtc_SimpleTimeProps = Array2Struct(
          objOptical.payload,
          index,
          Rtc_SimpleTimeType,
        );
        data.RTC = SimpleTimeToSTring(rtc);
        break;
      case OPTICAL_CMD.OPTICAL_GET_REGISTER:
        const typeSensor = objOptical.payload[index];
        index++;
        const pulse = objOptical.payload.readUintLE(index, 4);
        switch (typeSensor) {
          case IdentitySensor.LC_METER.id:
            data['Dữ liệu'] = (pulse * IdentitySensor.LC_METER.factor).toFixed(
              2,
            );
            break;
          case IdentitySensor['1l/v'].id:
            data['Dữ liệu'] = (pulse * IdentitySensor['1l/v'].factor).toFixed(
              2,
            );
            break;
          case IdentitySensor['0.25l/v'].id:
            data['Dữ liệu'] = (
              pulse * IdentitySensor['0.25l/v'].factor
            ).toFixed(2);
            break;
          case IdentitySensor['0.5l/1v'].id:
            data['Dữ liệu'] = (
              pulse * IdentitySensor['0.5l/1v'].factor
            ).toFixed(2);
            break;
          case IdentitySensor['5l/1v'].id:
            data['Dữ liệu'] = (pulse * IdentitySensor['5l/1v'].factor).toFixed(
              2,
            );
            break;
          default:
            data['Dữ liệu'] = 'unknown';
        }
        break;
      case OPTICAL_CMD.OPTICAL_GET_LIST_DATA_DAILY:
        const numRecord =
          objOptical.header.u8Length / sizeof(DataManager_IlluminateRecordType);
        for (let i = 0; i < numRecord; i++) {
          const strDataDaily: DataManager_IlluminateRecordProps = Array2Struct(
            objOptical.payload,
            index,
            DataManager_IlluminateRecordType,
          );
          strDataDaily.au8CwData = Buffer.from(strDataDaily.au8CwData);
          strDataDaily.au8UcwData = Buffer.from(strDataDaily.au8UcwData);

          index += sizeof(DataManager_IlluminateRecordType);

          const date = new Date();
          date.setFullYear(strDataDaily.SimpleTime.u8Year + 2000);
          if (strDataDaily.SimpleTime.u8Month < 1) {
            response.message = 'strDataDaily.SimpleTime.u8Year.u8Month < 1';
            response.bSucceed = false;
            return response;
          }
          date.setMonth(strDataDaily.SimpleTime.u8Month - 1);
          date.setDate(strDataDaily.SimpleTime.u8Date);
          date.setHours(strDataDaily.SimpleTime.u8Hour);
          date.setMinutes(strDataDaily.SimpleTime.u8Minute);
          date.setSeconds(strDataDaily.SimpleTime.u8Second);

          const cwLit = strDataDaily.au8CwData.readUintLE(0, 4);
          const uCwLit = strDataDaily.au8UcwData.readUintLE(0, 4);
          const lit = cwLit - uCwLit;

          dataDaily.push({
            'Thời điểm chốt(full time)': formatDateTimeDB(date),
            'Thời điểm chốt': SimpleTimeToSTring(strDataDaily.SimpleTime),
            'Dữ liệu xuôi': cwLit.toString(),
            'Dữ liệu ngược': uCwLit.toString(),
            'Chỉ số': lit.toString(),
          });
        }
        break;
      case OPTICAL_CMD.OPTICAL_GET_TIME_SEND:
        {
        }
        break;
    }

    if (objOptical.header.u8FSN === 0xff) {
      break;
    } else {
      // send ack
      await opticalSendAck();
    }
  } while (1);

  if (props.desiredCmd === OPTICAL_CMD.OPTICAL_GET_LIST_DATA_DAILY) {
    data['Dữ liệu hàng ngày'] = dataDaily;
  }

  response.bSucceed = true;
  response.obj = data;
  return response;
}
