import { emitEventFailure, emitEventSuccess } from '../../service/event';
import {
  FieldOpticalResponseProps,
  OpticalDailyProps,
  opticalSend,
  opticalShakeHand,
  waitOpticalAdvance,
} from '../../service/hhu/Optical/opticalFunc';
import {
  OPTICAL_CMD,
  OPTICAL_CMD_INFO_PROTOCOL,
  Optical_HeaderProps,
  Optical_HostPortType,
  Optical_PasswordType,
  Optical_SeriType,
  SIZE_HOST,
} from '../../service/hhu/Optical/opticalProtocol';
import { SIZE_SERIAL } from '../../service/hhu/RF/radioProtocol';
import {
  ByteArrayFromHexString,
  ByteArrayFromString,
  ByteArrayToString,
  isNumeric,
  showAlert,
  showAlertProps,
} from '../../util';
import { sizeof } from '../../util/struct-and-array';
import { hookProps, RadioTextProps } from './controller';
import { Buffer } from 'buffer';
import { checkMeterNo, checkModuleNo } from '../../service/api';

function checkIsItemSelected(): boolean {
  let hasItem = false;

  for (let item in hookProps.state) {
    if (typeof hookProps.state[item] === 'object') {
      let valueObj = hookProps.state[item] as RadioTextProps;
      if (valueObj.checked) {
        hasItem = true;

        break;
      }
    }
  }

  return hasItem;
}

export function setStatus(str: string) {
  hookProps.setState(state => {
    state.status = str;
    return { ...state };
  });
}

function clearBeforeRead() {
  if (hookProps.state.seriMeter.checked) {
    hookProps.refSeriMeter.current?.setNativeProps({
      text: '',
    });
  }
  if (hookProps.state.seriModule.checked) {
    hookProps.refSeriModule.current?.setNativeProps({
      text: '',
    });
  }
  if (hookProps.state.immediateData.checked) {
    hookProps.refImmediateData.current?.setNativeProps({
      text: '',
    });
  }
  if (hookProps.state.ipPort.checked) {
    hookProps.refIPPort.current?.setNativeProps({
      text: '',
    });
  }
}

export async function onReadOpticalPress() {
  let message = '';
  let bHasError = false;
  try {
    if (hookProps.state.isBusy) {
      return;
    }
    let hasItem = checkIsItemSelected();
    if (hasItem !== true) {
      showAlert('Chưa có item nào được chọn');
      return;
    }

    clearBeforeRead();

    hookProps.setState(state => {
      state.isBusy = true;
      return { ...state };
    });

    let bRet = await opticalShakeHand('00000000');
    if (!bRet) {
      message += 'Bắt tay cổng quang lỗi. ';
      bHasError = true;
    } else {
      const timeout = 3000;

      const header = {} as Optical_HeaderProps;
      header.u8FSN = 0xff;
      header.u8Length = 0;

      let payload: Buffer | undefined;
      let cmd: number = 0;
      if (hookProps.state.seriMeter.checked) {
        console.log('get seri meter');

        cmd = OPTICAL_CMD.OPTICAL_GET_SERIAL;
        payload = Buffer.alloc(1);

        payload[0] = Optical_SeriType.OPTICAL_TYPE_SERI_METER;
        header.u8Length = payload.byteLength;
        header.u8Command = cmd;
        bRet = await opticalSend(header, payload);

        if (bRet) {
          const response = await waitOpticalAdvance({
            desiredCmd: cmd,
            timeout: timeout,
          });

          if (response.bSucceed) {
            if (response.obj) {
              const data = response.obj as {
                [key in FieldOpticalResponseProps]:
                  | string
                  | OpticalDailyProps[];
              };
              const strSeriMeter = data['Seri đồng hồ'];
              hookProps.refSeriMeter.current?.setNativeProps({
                text: strSeriMeter,
              });
              hookProps.data.seriMeter = strSeriMeter as string;
              // hookProps.setState(state => {
              //   state.seriMeter.value = strSeriMeter as string;
              //   return {...state};
              // });
            }
          } else {
            message += 'Lỗi: ' + response.message + '. ';

            //setStatus(message);
          }
        }
      }
      if (hookProps.state.seriModule.checked) {
        cmd = OPTICAL_CMD.OPTICAL_GET_SERIAL;
        payload = Buffer.alloc(1);
        payload[0] = Optical_SeriType.OPTICAL_TYPE_SERI_MODULE;
        header.u8Length = payload.byteLength;
        header.u8Command = cmd;
        bRet = await opticalSend(header, payload);
        if (bRet) {
          const response = await waitOpticalAdvance({
            desiredCmd: cmd,
            timeout: timeout,
          });
          if (response.bSucceed) {
            if (response.obj) {
              const data = response.obj as {
                [key in FieldOpticalResponseProps]:
                  | string
                  | OpticalDailyProps[];
              };
              const strSeriModule = data['Seri module'];
              hookProps.refSeriModule.current?.setNativeProps({
                text: strSeriModule,
              });
              // hookProps.setState(state => {
              //   state.seriModule.value = strSeriModule as string;
              //   return {...state};
              // });
              hookProps.data.seriModule = strSeriModule as string;
            }
          } else {
            message += 'Lỗi: ' + response.message + '. ';

            //setStatus(message);
          }
        }
      }

      if (hookProps.state.immediateData.checked) {
        cmd = OPTICAL_CMD.OPTICAL_GET_REGISTER;
        payload = undefined;

        header.u8Command = cmd;
        header.u8Length = 0;
        bRet = await opticalSend(header, payload);
        if (bRet) {
          const response = await waitOpticalAdvance({
            desiredCmd: cmd,
            timeout: timeout,
          });

          if (response.bSucceed) {
            if (response.obj) {
              const data = response.obj as {
                [key in FieldOpticalResponseProps]:
                  | string
                  | OpticalDailyProps[];
              };
              //console.log(data['Dữ liệu']);
              const strImmediateData = data['Dữ liệu'];
              hookProps.refImmediateData.current?.setNativeProps({
                text: strImmediateData,
              });
              // hookProps.setState(state => {
              //   state.immediateData.value = strImmediateData as string;
              //   return {...state};
              // });
              hookProps.data.immediateData = strImmediateData as string;
            }
          } else {
            message += 'Lỗi: ' + response.message + '. ';

            //setStatus(message);
          }
        }
      }
      if (hookProps.state.ipPort.checked) {
        cmd = OPTICAL_CMD.OPTICAL_GET_INFO_PROTOCOL;
        payload = Buffer.alloc(1);

        payload[0] = OPTICAL_CMD_INFO_PROTOCOL.OPTION_HOST_PORT_INFO_RP;

        header.u8Command = cmd;
        header.u8Length = payload.byteLength;
        bRet = await opticalSend(header, payload);
        if (bRet) {
          const response = await waitOpticalAdvance({
            desiredCmd: cmd,
            timeout: timeout,
          });

          if (response.bSucceed) {
            if (response.obj) {
              const data = response.obj as {
                [key in FieldOpticalResponseProps]:
                  | string
                  | OpticalDailyProps[];
              };

              const IpPort = data['IP-Port'];
              console.log('IpPort:', IpPort);
              hookProps.refIPPort.current?.setNativeProps({
                text: IpPort,
              });
              // hookProps.setState(state => {
              //   state.immediateData.value = strImmediateData as string;
              //   return {...state};
              // });
              hookProps.data.ipPortString = IpPort as string;
            }
          } else {
            message += 'Lỗi: ' + response.message + '. ';

            //setStatus(message);
          }
        }
      }
      message += 'Đọc xong. ';
    }
  } catch (e: any) {
    message += e.message;
    bHasError = true;
  } finally {
    hookProps.setState(state => {
      state.status = message;
      state.isBusy = false;
      return { ...state };
    });
    if (bHasError) {
      emitEventFailure();
    } else {
      emitEventSuccess();
    }
  }
}

async function checkCondition(): Promise<boolean> {
  let text = '';
  if (hookProps.state.seriMeter.checked) {
    text = hookProps.data.seriMeter.trim();
    if (text !== '0') {
      if (isNumeric(text) === false) {
        //|| text.length !== 10
        console.log('text 1:', text);
        await showAlert('Số seri đồng hồ không hợp lệ');

        hookProps.refSeriMeter.current?.clear();
        return false;
      }
    }
  }
  if (hookProps.state.seriModule.checked) {
    text = hookProps.data.seriModule.trim();
    if (isNumeric(text) === false) {
      //|| text.length !== 10
      console.log('text 2:', text);
      await showAlert('Số seri module không hợp lệ');
      hookProps.refSeriModule.current?.clear();
      return false;
    }
  }
  if (hookProps.state.immediateData.checked) {
    text = hookProps.data.immediateData.trim();
    if (isNumeric(text) === false) {
      console.log('text 3:', text);
      await showAlert('Chỉ số không hợp lệ');
      hookProps.refImmediateData.current?.clear();
      return false;
    }
  }
  if (hookProps.state.ipPort.checked) {
    text = hookProps.data.ipPortString.trim();
    if (text.length <= 10 || text.includes(':') === false) {
      console.log('text 3:', text);
      await showAlert('IP Port không hợp lệ.Ex: 222.252.14.125:3033');
      hookProps.refImmediateData.current?.clear();
      return false;
    }
  }

  return true;
}

async function checkMeterNoExist() {
  if (hookProps.state.seriMeter.checked) {
    const noMeter = hookProps.data.seriMeter;
    const ret = await checkMeterNo({ NO: noMeter });
    if (ret.bSucceeded === false && ret.strMessage.length > 0) {
      showAlertProps({
        message:
          'chú ý số NO đồng hồ: ' +
          noMeter +
          ' ' +
          (ret.strMessage === 'existed'
            ? 'đã tồn tại trên hệ thống'
            : ret.strMessage),
      });
    }
  }
  if (hookProps.state.seriModule.checked) {
    const noModule = hookProps.data.seriModule;
    const ret = await checkModuleNo({ NO: noModule });
    if (ret.bSucceeded === false && ret.strMessage.length > 0) {
      showAlertProps({
        message:
          'chú ý số NO module: ' +
          noModule +
          ' ' +
          (ret.strMessage === 'existed'
            ? 'đã tồn tại trên hệ thống'
            : ret.strMessage),
      });
    }
  }
}

export async function onWriteOpticalPress() {
  let message = '';
  let bHasError = false;

  try {
    if (hookProps.state.isBusy) {
      return;
    }
    let hasItem = checkIsItemSelected();
    if (hasItem !== true) {
      showAlert('Chưa có item nào được chọn');
      bHasError = true;
      return;
    }

    if ((await checkCondition()) === false) {
      bHasError = true;
      return;
    }

    // console.log('hook props data:', hookProps.data);

    hookProps.setState(state => {
      state.isBusy = true;
      return { ...state };
    });

    checkMeterNoExist();

    let bRet = await opticalShakeHand('12345', Optical_PasswordType.PW_TYPE_P2);
    if (!bRet) {
      message += 'Bắt tay cổng quang lỗi. ';
      bHasError = true;
    } else {
      const timeout = 2000;

      const header = {} as Optical_HeaderProps;
      header.u8FSN = 0xff;
      header.u8Length = 0;

      let payload: Buffer | undefined;
      let cmd: number = 0;
      let index = 0;
      if (hookProps.state.seriMeter.checked) {
        cmd = OPTICAL_CMD.OPTICAL_SET_SERIAL;
        payload = Buffer.alloc(1 + SIZE_SERIAL);
        index = 0;
        payload[index] = Optical_SeriType.OPTICAL_TYPE_SERI_METER;
        index++;
        payload.writeUintLE(
          Number(hookProps.data.seriMeter),
          index,
          SIZE_SERIAL,
        );
        index += SIZE_SERIAL;
        header.u8Length = payload.byteLength;
        header.u8Command = cmd;
        bRet = await opticalSend(header, payload);
        if (bRet) {
          const response = await waitOpticalAdvance({
            desiredCmd: OPTICAL_CMD.OPTICAL_ACK,
            timeout: timeout,
          });
          if (response.bSucceed) {
            message += 'Cài seri đồng hồ thành công. ';
          } else {
            message += 'Lỗi: ' + response.message + '. ';
            bHasError = true;
            //setStatus(message);
          }
        }
      }
      if (hookProps.state.seriModule.checked) {
        cmd = OPTICAL_CMD.OPTICAL_SET_SERIAL;
        payload = Buffer.alloc(1 + SIZE_SERIAL);
        index = 0;
        payload[index] = Optical_SeriType.OPTICAL_TYPE_SERI_MODULE;
        index++;
        payload.writeUintLE(
          Number(hookProps.data.seriModule),
          index,
          SIZE_SERIAL,
        );
        index += SIZE_SERIAL;
        header.u8Length = payload.byteLength;
        header.u8Command = cmd;
        bRet = await opticalSend(header, payload);
        if (bRet) {
          const response = await waitOpticalAdvance({
            desiredCmd: OPTICAL_CMD.OPTICAL_ACK,
            timeout: timeout,
          });
          if (response.bSucceed) {
            message += 'Cài seri module thành công. ';
          } else {
            message += 'Lỗi: ' + response.message + '. ';
            bHasError = true;
            //setStatus(message);
          }
        }
      }
      if (hookProps.state.immediateData.checked) {
        cmd = OPTICAL_CMD.OPTICAL_SET_DATA_NO_FACTOR_PULSE;
        payload = Buffer.alloc(4);
        index = 0;
        payload.writeUintLE(Number(hookProps.data.immediateData), index, 4);
        index += 4;
        header.u8Length = payload.byteLength;
        header.u8Command = cmd;
        bRet = await opticalSend(header, payload);
        if (bRet) {
          const response = await waitOpticalAdvance({
            desiredCmd: OPTICAL_CMD.OPTICAL_ACK,
            timeout: timeout,
          });
          if (response.bSucceed) {
            message += 'Cài chỉ số thành công. ';
          } else {
            message += 'Lỗi: ' + response.message + '. ';
            //setStatus(message);
            bHasError = true;
          }
        }
      }
      if (hookProps.state.ipPort.checked) {
        const textIpPort = hookProps.data.ipPortString.trim();
        const arrTextIPPort = textIpPort.split(':');
        const textIP = arrTextIPPort[0].trim();
        const u32Port = Number(arrTextIPPort[1].trim());

        console.log('textIP:', textIP);
        console.log('u32Port:', u32Port);

        cmd = OPTICAL_CMD.OPTICAL_SET_INFO_PROTOCOL;
        payload = Buffer.alloc(1 + sizeof(Optical_HostPortType));
        payload.fill(0);

        index = 0;
        payload[index] = OPTICAL_CMD_INFO_PROTOCOL.OPTION_HOST_PORT_INFO_RP;
        index++;

        const byteHost = ByteArrayFromString(textIP);
        console.log(
          'textIP:',
          ByteArrayToString(byteHost, 0, byteHost.length, 16),
        );
        byteHost.copy(payload, index);
        console.log('textIP:', ByteArrayToString(payload, index, 36, 16));
        index += SIZE_HOST;
        payload.writeUIntLE(u32Port, index, 2);

        header.u8Length = payload.byteLength;
        header.u8Command = cmd;
        bRet = await opticalSend(header, payload);
        if (bRet) {
          const response = await waitOpticalAdvance({
            desiredCmd: OPTICAL_CMD.OPTICAL_ACK,
            timeout: timeout,
          });
          if (response.bSucceed) {
            message += 'Cài IP port thành công. ';
          } else {
            message += 'Lỗi: ' + response.message + '. ';
            //setStatus(message);
            bHasError = true;
          }
        }
      }
      if (hookProps.state.forceSendImmediately.checked) {
        cmd = OPTICAL_CMD.OPTICAL_REQUEST_SEND_DATA;
        payload = Buffer.alloc(1 + sizeof(Optical_HostPortType));
        payload.fill(0);

        header.u8Length = 0;
        header.u8Command = cmd;
        bRet = await opticalSend(header);
        if (bRet) {
          const response = await waitOpticalAdvance({
            desiredCmd: OPTICAL_CMD.OPTICAL_ACK,
            timeout: timeout,
          });
          if (response.bSucceed) {
            message += 'yêu cầu module gửi dữ liệu thành công. ';
          } else {
            message += 'Lỗi: ' + response.message + '. ';
            //setStatus(message);
            bHasError = true;
          }
        }
      }
      message += 'Hoàn thành. ';
    }
  } catch (e: any) {
    message += e.message;
    bHasError = true;
  } finally {
    const date = new Date();
    hookProps.setState(state => {
      state.status = message + ' ' + date.toLocaleTimeString('vi');
      state.isBusy = false;
      return { ...state };
    });
    if (bHasError) {
      emitEventFailure();
    } else {
      emitEventSuccess();
    }
  }
}
