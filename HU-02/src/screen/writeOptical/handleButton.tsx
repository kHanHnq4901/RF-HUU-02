import {
  FieldOpticalResponseProps,
  OpticalDailyProps,
  opticalSend,
  opticalShakeHand,
  waitOpticalAdvance,
} from '../../service/hhu/Optical/opticalFunc';
import {
  OPTICAL_CMD,
  Optical_HeaderProps,
  Optical_PasswordType,
  Optical_SeriType,
} from '../../service/hhu/Optical/opticalProtocol';
import {SIZE_SERIAL} from '../../service/hhu/RF/radioProtocol';
import {showAlert} from '../../util';
import {hookProps, RadioTextProps} from './controller';
import {Buffer} from 'buffer';

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
    return {...state};
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
}

export async function onReadOpticalPress() {
  let message = '';
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
      return {...state};
    });

    let bRet = await opticalShakeHand('00000000');
    if (!bRet) {
      message += 'Bắt tay cổng quang lỗi. ';
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
              hookProps.setState(state => {
                state.seriMeter.value = strSeriMeter as string;
                return {...state};
              });
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
              hookProps.setState(state => {
                state.seriModule.value = strSeriModule as string;
                return {...state};
              });
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
              hookProps.setState(state => {
                state.immediateData.value = strImmediateData as string;
                return {...state};
              });
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
  } finally {
    hookProps.setState(state => {
      state.status = message;
      state.isBusy = false;
      return {...state};
    });
  }
}

export async function onWriteOpticalPress() {
  let message = '';
  try {
    if (hookProps.state.isBusy) {
      return;
    }
    let hasItem = checkIsItemSelected();
    if (hasItem !== true) {
      showAlert('Chưa có item nào được chọn');
      return;
    }

    hookProps.setState(state => {
      state.isBusy = true;
      return {...state};
    });

    let bRet = await opticalShakeHand('12345', Optical_PasswordType.PW_TYPE_P2);
    if (!bRet) {
      message += 'Bắt tay cổng quang lỗi. ';
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
          Number(hookProps.state.seriMeter.value),
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
            message += 'Cài sei đồng hồ thành công. ';
          } else {
            message += 'Lỗi: ' + response.message + '. ';
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
          Number(hookProps.state.seriModule.value),
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
            message += 'Cài sei module thành công. ';
          } else {
            message += 'Lỗi: ' + response.message + '. ';
            //setStatus(message);
          }
        }
      }
      if (hookProps.state.immediateData.checked) {
        cmd = OPTICAL_CMD.OPTICAL_SET_DATA_NO_FACTOR_PULSE;
        payload = Buffer.alloc(4);
        index = 0;
        payload.writeUintLE(
          Number(hookProps.state.immediateData.value),
          index,
          4,
        );
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
            message += 'Cài sei chỉ số thành công. ';
          } else {
            message += 'Lỗi: ' + response.message + '. ';
            //setStatus(message);
          }
        }
      }
      message += 'Hoàn thành. ';
    }
  } catch (e: any) {
    message += e.message;
  } finally {
    hookProps.setState(state => {
      state.status = message;
      state.isBusy = false;
      return {...state};
    });
  }
}