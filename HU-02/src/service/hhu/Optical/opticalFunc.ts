import {Buffer} from 'buffer';
import {crc16, crc16_offset} from '../../../util/crc16';
import {
  Array2Struct,
  Struct2Array,
  sizeof,
} from '../../../util/struct-and-array';
import {
  PropsResponse,
  TYPE_HHU_CMD,
  TYPE_OBJ,
  hhuFunc_HeaderProps,
  hhuFunc_PropsObjAnalysis,
  hhuFunc_Send,
  hhuFunc_wait,
} from '../Ble/hhuFunc';
import {PropsRead} from '../RF/RfFunc';
import {
  Rtc_SimpleTimeProps,
  Rtc_SimpleTimeType,
  SIZE_SERIAL,
} from '../RF/radioProtocol';
import {SimpleTimeToSTring, formatDateTimeDB} from '../util/utilFunc';
import {
  DataManager_IlluminateRecordProps,
  DataManager_IlluminateRecordType,
  IdentitySensor,
  OPTICAL_CMD,
  OPTICAL_CMD_INFO_PROTOCOL,
  OPTICAL_TYPE_GET_DATA_DAILY,
  Optical_HeaderProps,
  Optical_HeaderType,
  Optical_HostPortProps,
  Optical_HostPortType,
  Optical_MoreInfoProps,
  Optical_MoreInfoType,
  Optical_PasswordType,
  Optical_SensorInfoProps,
  Optical_SensorInfoType,
  Optical_SeriType,
  Optical_TestRFProps,
  Optical_TestRFType,
  Optical_TimeRtcProps,
  Optical_TimeSendProps,
  Optical_TimeSendType,
  Rtc_CalendarProps,
  Rtc_CalendarType,
  SIZE_HOST,
  Sensor_NvmErrorProps,
  Sensor_NvmErrorType,
} from './opticalProtocol';
import {aes_128_dec, aes_128_en} from '../../../util/aes128';
import {store} from '../../../component/drawer/drawerContent/controller';
import {log} from 'react-native-reanimated';
import {Get_State_Reset, Get_State_Reset_By_User, convertRtcTime2String, getStateSend} from './opticalUtil';
import { StringFromArray } from '../../../util';

const TAG = 'opticalFunc:';

const OPTICAL_SIZE_PASS = 8;

let bAesOptical = true;

export type FieldOpticalResponseProps =
  | 'Seri đồng hồ'
  | 'Seri module'
  | 'RTC'
  | 'Version'
  | 'Điện áp'
  | 'Dữ liệu'
  | 'Dữ liệu hàng ngày'
  | 'Reset'
  | 'UReset'
  | 'Reset State'
  | 'UReset State'
  | 'Sen 0'
  | 'Sen 1'
  | 'Sen 2'
  | 'Thời gian gửi lần tiếp'
  | 'Lần cuối gửi'
  | 'Lần cuối thành công'
  | 'Trạng thái gửi'
  | 'Test RF'
  | 'Rssi'
  | 'Có IP'
  | 'QCCID'
  | 'IMSI'
  | 'APN'
  | 'IP-Port';

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

export async function opticalShakeHand(
  password: string,
  typePassword?: Optical_PasswordType,
): Promise<boolean> {
  if (password.length > 8) {
    console.log('password is too length');
    return false;
  }
  // bAesOptical = false;

  for (let i = 0; i < 2; i++) {
    console.log('i:', i);

    const header = {} as Optical_HeaderProps;
    let index = 0;
    const buffPass = Buffer.from(password);
    const payload = Buffer.alloc(1 /* type password */ + OPTICAL_SIZE_PASS);
    payload.fill(0);
    if (typePassword) {
      payload[index] = typePassword;
    } else {
      payload[index] = Optical_PasswordType.PW_TYPE_P1;
    }

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
      bAesOptical = !bAesOptical;
      console.log(TAG, 'change bAesOptical');
    } else {
      return true;
    }
  }

  return false;
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
  let payloadOptical = Buffer.alloc(lengthPayloadOptical);
  Struct2Array(Optical_HeaderType, header, payloadOptical, 0);
  index += sizeof(Optical_HeaderType);
  if (payload && header.u8Length > 0) {
    payload.copy(payloadOptical, index, 0, header.u8Length);
    index += header.u8Length;
  }
  const crc = crc16(payloadOptical, index);
  payloadOptical.writeUintLE(crc, index, 2);
  index += 2;

  if (bAesOptical) {
    const u8LengthNeedEncrypt = header.u8Length + 2; /* crc */
    let u8NumBatch16 = 0;
    if (u8LengthNeedEncrypt % 16 === 0) {
      u8NumBatch16 = u8LengthNeedEncrypt / 16;
    } else {
      u8NumBatch16 = (0xff & (u8LengthNeedEncrypt / 16)) + 1; // math ceil
    }
    let u8LengthEncrypt = u8NumBatch16 * 16;

    let u8LengthSend = sizeof(Optical_HeaderType) + u8LengthEncrypt;

    const payloadWithAes = Buffer.alloc(u8LengthSend);
    payloadOptical.copy(payloadWithAes);
    aes_128_en(
      store.state.keyAes.keyOptical,
      payloadWithAes,
      sizeof(Optical_HeaderType),
      u8NumBatch16,
    );
    payloadOptical = payloadWithAes;
  }

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

  let crc_buff = 0;
  let u16Crc = 0;
  if (bAesOptical) {
    let lengthFrame = payload.length - index;
    let u8NumBatchAes = lengthFrame - sizeof(Optical_HeaderType);

    if (u8NumBatchAes % 16 !== 0) {
      console.log(TAG, 'length % 16\n');

      response.bSucceed = false;
      response.message = 'length % 16\n';

      return response;
    }
    u8NumBatchAes /= 16;

    aes_128_dec(
      store.state.keyAes.keyOptical,
      payload,
      index + sizeof(Optical_HeaderType),
      u8NumBatchAes,
    );
  } else {
  }
  u16Crc = crc16_offset(
    payload,
    index,
    sizeof(Optical_HeaderType) + headerOptical.u8Length,
  );
  crc_buff = payload.readUintLE(
    index + sizeof(Optical_HeaderType) + headerOptical.u8Length,
    2,
  );

  if (u16Crc !== crc_buff) {
    response.bSucceed = false;
    response.message = 'crc optical not match';
    return response;
  }

  index += sizeof(Optical_HeaderType);

  response.bSucceed = true;
  response.obj = {} as ObjResponseOpticalProps;
  response.obj.header = headerOptical;

  // const newPayload = Buffer.alloc(headerOptical.u8Length);
  // payload.copy(newPayload, 0, index, headerOptical.u8Length);

  response.obj.payload = Buffer.from(
    payload.subarray(index, index + headerOptical.u8Length),
  ); //payload.slice(index, index + headerOptical.u8Length);

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
  //console.log('responseHhuOptical:', responseHhuOptical);
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
      response.message = responseOptical.message ?? 'Lỗi không xác định';
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
          console.log('get serial meter');
        }

        if (typeSeri === Optical_SeriType.OPTICAL_TYPE_SERI_MODULE) {
          data['Seri module'] = objOptical.payload
            .readUintLE(index, SIZE_SERIAL)
            .toString();
          console.log('get serial module');
        }

        break;
      case OPTICAL_CMD.OPTICAL_GET_VERSION:
        data.Version = objOptical.payload[index].toString();
        console.log('get version');
        break;
      case OPTICAL_CMD.OPTICAL_GET_MORE:
        const more: Optical_MoreInfoProps = Array2Struct(
          objOptical.payload,
          index,
          Optical_MoreInfoType,
        );
        data['Điện áp'] = more.fVoltage.toFixed(2);
        console.log('get more');
        break;
      case OPTICAL_CMD.OPTICAL_GET_RTC:
        const rtc: Rtc_SimpleTimeProps = Array2Struct(
          objOptical.payload,
          index,
          Rtc_SimpleTimeType,
        );
        data.RTC = SimpleTimeToSTring(rtc);
        console.log('get rtc');
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
        console.log('get register');
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
            'Thời điểm chốt(full time)': undefined as unknown as string,
            // 'Thời điểm chốt': SimpleTimeToSTring(strDataDaily.SimpleTime),
            'Thời điểm chốt': formatDateTimeDB(date),
            'Dữ liệu xuôi': cwLit.toString(),
            'Dữ liệu ngược': uCwLit.toString(),
            'Chỉ số': lit.toString(),
          });
        }
        break;
      case OPTICAL_CMD.OPTICAL_GET_ERROR_SYSTEM:
        {
          const error: Sensor_NvmErrorProps = Array2Struct(
            objOptical.payload,
            index,
            Sensor_NvmErrorType,
          );
          data.Reset = error.u32NumReset.toString();
          data.UReset = error.u32PositionUserReset.toString();
          data['Reset State'] = Get_State_Reset(error.u16ResetState);
          data['UReset State'] = Get_State_Reset_By_User(
            error.u8ResetStateByUser,
          );

          console.log('get error system');
        }
        break;
      case OPTICAL_CMD.OPTICAL_GET_SENSOR_OBJ_INDIRECT_LC:
        {
          const sensorObj: Optical_SensorInfoProps = Array2Struct(
            objOptical.payload,
            index,
            Optical_SensorInfoType,
          );
          let chanel = 0;
          data['Sen 0'] = `min:${sensorObj.sensor[chanel].u8Min}-max:${
            sensorObj.sensor[chanel].u8Max
          }-tb:${sensorObj.sensor[chanel].u8CenterLine}-delta:${
            sensorObj.sensor[chanel].u8Max - sensorObj.sensor[chanel].u8Min
          }`;
          chanel++;
          data['Sen 1'] = `min:${sensorObj.sensor[chanel].u8Min}-max:${
            sensorObj.sensor[chanel].u8Max
          }-tb:${sensorObj.sensor[chanel].u8CenterLine}-delta:${
            sensorObj.sensor[chanel].u8Max - sensorObj.sensor[chanel].u8Min
          }`;
          chanel++;
          data['Sen 2'] = `min:${sensorObj.sensor[chanel].u8Min}-max:${
            sensorObj.sensor[chanel].u8Max
          }-tb:${sensorObj.sensor[chanel].u8CenterLine}-delta:${
            sensorObj.sensor[chanel].u8Max - sensorObj.sensor[chanel].u8Min
          }`;
          chanel++;

          console.log('get info sensor');
        }
        break;
        case OPTICAL_CMD.OPTICAL_GET_TIME_SEND:
          {
            console.log('index:', index);
            
            const timeSend: Optical_TimeSendProps = Array2Struct(
              objOptical.payload,
              index,
              Optical_TimeSendType,
            );

            console.log('timeSend:', timeSend);
            
            data['Thời gian gửi lần tiếp'] = convertRtcTime2String(timeSend.next);
            data['Lần cuối gửi'] = convertRtcTime2String(timeSend.last);
            data['Thời gian gửi lần tiếp'] = convertRtcTime2String(timeSend.lastSucceed);
            data['Trạng thái gửi'] = getStateSend(timeSend.u8State);
            console.log('get time send');
          }
          break;
        case OPTICAL_CMD.OPTICAL_TEST_RF:
          const testRF: Optical_TestRFProps = Array2Struct(
            objOptical.payload,
            index,
            Optical_TestRFType,
          );

          data['Test RF'] = testRF.u8Succeed ? 'Thành công' : 'Thất bại';
          if(testRF.u8Succeed)
          {
            data.Rssi = testRF.s8RssiSlaveRec.toString();
            data['Có IP'] = testRF.u8HasIP ? 'Có': 'NO_IP';
            data.QCCID= StringFromArray(Buffer.from(testRF.au8Qccid), 0, testRF.au8Qccid.length);
            data.IMSI= StringFromArray(Buffer.from(testRF.au8IMSI), 0, testRF.au8IMSI.length);
            data.APN= StringFromArray(Buffer.from(testRF.au8Apn), 0, testRF.au8Apn.length);
            
          }
          console.log('test rf');
          
          break;
        case OPTICAL_CMD.OPTICAL_GET_INFO_PROTOCOL:
          const type = objOptical.payload[index];
          index ++;
          switch(type){
            case OPTICAL_CMD_INFO_PROTOCOL.OPTION_HOST_PORT_INFO_RP:

              const objProtocol: Optical_HostPortProps = Array2Struct(
                objOptical.payload,
                index,
                Optical_HostPortType,
              );

              const strIP = StringFromArray(Buffer.from(objProtocol.au8Host), 0, SIZE_HOST);
              const port = objProtocol.u16Port;
              
              data['IP-Port'] = strIP+':'+port;
            break;
          case OPTICAL_CMD_INFO_PROTOCOL.OPTION_USER_PASSWORD_TOPIC_RP:
            console.log('now no support OPTION_USER_PASSWORD_TOPIC_RP');

          break;

          }
          
          console.log('get info protocol');
          
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

export async function OpticalFunc_Read(
  props: PropsRead,
): Promise<PropsResponse> {
  console.log(TAG, props);

  const response = {} as PropsResponse;

  response.bSucceed = false;
  response.message = '';

  let message: string = '';

  let bRet = await opticalShakeHand(
    '00000000',
    Optical_PasswordType.PW_TYPE_P1,
  );
  if (!bRet) {
    message += 'Bắt tay cổng quang lỗi';
    response.message = message;
    return response;
  }

  const header = {} as Optical_HeaderProps;
  let payload: Buffer | undefined;

  // read serial then check
  let typeSeri = Optical_SeriType.OPTICAL_TYPE_SERI_METER;
  let cmd = OPTICAL_CMD.OPTICAL_GET_SERIAL;
  payload = Buffer.alloc(1);

  header.u8FSN = 0xff;
  header.u8Length = 0;
  payload[0] = typeSeri;
  header.u8Length = payload.byteLength;
  header.u8Command = cmd;
  bRet = await opticalSend(header, payload);
  if (bRet) {
    const res = await waitOpticalAdvance({
      desiredCmd: cmd,
      timeout: 2000,
    });
    if (res.bSucceed) {
      console.log(response.obj);
    } else {
      return res;
    }
    if (res.obj) {
      const data = res.obj as {
        [key in FieldOpticalResponseProps]: string | OpticalDailyProps[];
      };
      if (data['Seri đồng hồ']) {
        if (props.seri === data['Seri đồng hồ']) {
          // do below
        } else {
          response.message += 'seri meter not match.';
          return response;
        }
      } else {
        response.message += 'Not find field seri meter.';
        return response;
      }
    }
  } else {
    response.message += 'Send Optical error.';
    return response;
  }

  // after check seri meter ok, read data
  console.log('\nget data after check serial\n');
  let index = 0;
  cmd = OPTICAL_CMD.OPTICAL_GET_LIST_DATA_DAILY;

  header.u8FSN = 0xff;
  header.u8Command = cmd;

  if (props.typeRead === 'Theo thời gian') {
    const calendar = {} as Rtc_CalendarProps;

    header.u8Length =
      1 /*type get */ + 1 /** is0h */ + 2 * sizeof(Rtc_CalendarType);
    payload = Buffer.alloc(header.u8Length);
    index = 0;
    payload[index] = OPTICAL_TYPE_GET_DATA_DAILY.TYPE_GET_BY_TIME;
    index++;
    if (props.is0h === true) {
      payload[index] = 1;
    } else {
      payload[index] = 0;
    }
    index++;

    if (!(props.dateEnd && props.dateStart)) {
      response.message = 'No have props.dateEnd && props.dateStatrt';
      return response;
    }
    calendar.u16Year = props.dateStart.getFullYear();
    calendar.u8Month = props.dateStart.getMonth() + 1;
    calendar.u8DayOfMonth = props.dateStart.getDate();
    calendar.u8Hours = props.dateStart.getHours();
    calendar.u8Minutes = props.dateStart.getMinutes();
    calendar.u8Seconds = props.dateStart.getSeconds();

    console.log('start time: ', calendar);

    Struct2Array(Rtc_CalendarType, calendar, payload, index);
    index += sizeof(Rtc_CalendarType);

    calendar.u16Year = props.dateEnd.getFullYear();
    calendar.u8Month = props.dateEnd.getMonth() + 1;
    calendar.u8DayOfMonth = props.dateEnd.getDate();
    calendar.u8Hours = props.dateEnd.getHours();
    calendar.u8Minutes = props.dateEnd.getMinutes();
    calendar.u8Seconds = props.dateEnd.getSeconds();

    console.log('end time: ', calendar);

    Struct2Array(Rtc_CalendarType, calendar, payload, index);
    index += sizeof(Rtc_CalendarType);
  } else {
    index = 0;
    header.u8Length = 3; /** type get + is 0h + num nearest */
    payload = Buffer.alloc(header.u8Length);
    payload[index] = OPTICAL_TYPE_GET_DATA_DAILY.TYPE_GET_BY_NEAREST;
    index++;
    if (props.is0h === true) {
      payload[index] = 1;
    } else {
      payload[index] = 0;
    }
    index++;
    payload[index] = props.numNearest ?? 8;
    index++;
  }
  bRet = await opticalSend(header, payload);

  if (bRet) {
    const res = await waitOpticalAdvance({
      desiredCmd: cmd,
      timeout: 5000,
    });
    if (res.bSucceed) {
      console.log(response.obj);
    } else {
      return res;
    }
    if (res.obj) {
      const data = res.obj as {
        [key in FieldOpticalResponseProps]: string | OpticalDailyProps[];
      };
      if (data['Dữ liệu hàng ngày']) {
        response.obj = data['Dữ liệu hàng ngày'];
        response.bSucceed = true;
      } else {
        response.message += 'Not find field Dữ liệu hàng ngày.';
        return response;
      }
    }
  } else {
    response.message += 'Send Optical error.';
    return response;
  }

  return response;
}
