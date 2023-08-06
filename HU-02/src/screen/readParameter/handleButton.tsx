import { Keyboard } from 'react-native';
import RNFS from 'react-native-fs';
import { ObjSend } from '../../service/hhu/Ble/hhuFunc';
import {
  PropsModelRadio,
  PropsRead,
  RfFunc_Read,
} from '../../service/hhu/RF/RfFunc';
import { PropsLabel } from '../../service/hhu/defineWM';
import { getUnitByLabel } from '../../service/hhu/util/utilFunc';
import { PATH_EXPORT_LOG } from '../../shared/path';
import { isAllNumeric, showAlert, showToast } from '../../util';
import * as controller from './controller';
import { hookProps, store } from './controller';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const TAG = 'handleButton ReadParams';

export let arrSeri: string[] = [];

export const setArrSeri = (_arrSeri: string[]) => {
  arrSeri = _arrSeri;
};

export const filterSeri = (seri: string): any[] => {
  let data: any[] = [];
  if (seri === '') {
    data = [...arrSeri];
  } else {
    for (let item of arrSeri) {
      if (item.includes(seri)) {
        data.push(item);
      }
    }
  }

  return data.reverse();
};

export const onEditSeriDone = (text: string): void => {
  if (text.trim().length === 0) {
    return;
  }
  let arrSet = new Set<string>(arrSeri);
  arrSet.add(text);
  arrSeri = Array.from(arrSet);
  if (arrSeri.length > 5) {
    arrSeri.shift();
  }
};

const checkCondition = (): boolean => {
  if (store.state.hhu.connect !== 'CONNECTED') {
    showToast('Chưa kết nối bluetooth');
    return false;
  }
  if (ObjSend.isShakeHanded !== true) {
    showToast('Chưa bắt tay được bluetooth');
    return false;
  }
  if (isAllNumeric(controller.hookProps.state.seri) === false) {
    showToast('Số Seri không hợp lệ');
    return false;
  }
  if (hookProps.state.typeMeter === 'Đồng hồ') {
    if (hookProps.state.typeRead === 'Theo thời gian') {
      const startTime = hookProps.state.dateStart.getTime();
      const endTime = hookProps.state.dateEnd.getTime();
      if (startTime > endTime) {
        showToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
        return false;
      }
    }
  }

  return true;
};

const readData = async (props: PropsRead) => {
  let numRetries = Number(store.state.appSetting.numRetriesRead);

  if (numRetries <= 0) {
    numRetries = 1;
  }

  try {
    for (let j = 0; j < numRetries; j++) {
      if (props.typeRead === 'Theo thời gian') {
        console.log('dateStart:' + props.dateStart?.toLocaleString());
        console.log('dateEnd:' + props.dateEnd?.toLocaleString());
      }

      const result = await RfFunc_Read(props);

      //console.log(TAG, 'result:', JSON.stringify(result));
      if (result.bSucceed === true) {
        const rows: string[][] = [];
        let row: string[] = [];
        const modelRadio: PropsModelRadio = result.obj;

        for (let key in modelRadio.info) {
          if (modelRadio.info[key]) {
            row = [];

            row.push(key);
            row.push(modelRadio.info[key] + getUnitByLabel(key as PropsLabel));
            //console.log(row);
            rows.push(row);
          }
        }

        //console.log('modelRadio.data:', modelRadio.data);

        let registerModule: string;

        for (let item of modelRadio.data) {
          for (let key in item) {
            if (item[key]) {
              const keyTypeScript: PropsLabel = key as unknown as PropsLabel;
              if (
                keyTypeScript !== 'Thời điểm chốt (full time)' &&
                keyTypeScript !== 'Xuôi' &&
                keyTypeScript !== 'Ngược'
              ) {
                row = [];
                row.push(key);
                row.push(item[key] + getUnitByLabel(key as PropsLabel));
                rows.push(row);

                if (keyTypeScript === 'Chỉ số') {
                  registerModule = item[key];
                }
              }
            }
          }
        }

        //console.log('rows:', rows);
        hookProps.setState(state => {
          state.status = 'Đọc thành công ' + controller.hookProps.state.seri;
          state.dataTable = [...state.dataTable, ...rows];
          state.registerModule = registerModule;
          //console.log('ok here');
          return { ...state };
        });
        break;
      } else {
        hookProps.setState(state => {
          if (j !== numRetries - 1) {
            state.status =
              'Thực hiện thất bại ' +
              ' lần ' +
              (j + 1).toString() +
              '. Đang thử lại ...';
          } else {
            state.status =
              'Thực hiện thất bại ' +
              controller.hookProps.state.seri +
              ': ' +
              result.message;
          }

          //result.message;
          //state.dataTable = rows;
          //console.log('ok here');
          return { ...state };
        });
      }
    }
  } catch (err) {
    console.log(TAG, err.message);
    return;
  }
};

export const onBtnReadPress = async () => {
  // //await BleFunc_StartNotification(ObjSend.id);
  // const buff = [
  //   0x87, 0xf6, 0xce, 0xbe, 0x01, 0x40, 0x06, 0xe8, 0x61, 0x88, 0xfc, 0xf3,
  //   0xa4, 0x1d, 0x39, 0x6b, 0x0a, 0x3a, 0xba, 0x92,
  // ];

  // const index = 7;

  // const payload = Buffer.from(buff);
  // aes_128_dec(payload, index, 1);

  // const str = BufferToString(payload, index, 16, 16, true);

  // console.log(str);

  // return;
  Keyboard.dismiss();
  if (checkCondition() === false) {
    return;
  }

  hookProps.registerMeter.ref.current?.clear();
  hookProps.userNote.ref.current?.clear();

  hookProps.setState(state => {
    state.isReading = true;
    state.requestStop = false;
    state.status = 'Đang đọc ...';
    state.dataTable = [];
    state.registerMeter = '';
    state.deltaRegister = '';
    state.userNote = '';
    return { ...state };
  });

  //init: 0x73 , reset 0x74, search 0x72, data
  await readData({
    seri: hookProps.state.seri,
    typeAffect: 'Đọc 1',
    typeRead: hookProps.state.typeRead,
    is0h: hookProps.state.is0h,
    numNearest: 10,
    dateStart: hookProps.state.dateStart,
    dateEnd: hookProps.state.dateEnd,
  });
  //await BleFunc_StopNotification(ObjSend.id);
  hookProps.setState(state => {
    state.isReading = false;
    if (state.status === 'Đang đọc ...') {
      state.status = '';
    }
    return { ...state };
  });
  return;
};

let oldContent = '';
export async function onSaveLogPress() {
  let content = '';

  if (!hookProps.state.dataTable.length) {
    showAlert('Chưa có dữ liệu');
    console.log(
      'hookProps.state.dataTable.length:',
      hookProps.state.dataTable.length,
    );

    return;
  }
  if (hookProps.state.registerMeter === '') {
    showAlert('Chưa có chỉ số cơ khí');

    return;
  }

  for (let data of hookProps.state.dataTable) {
    let first = true;
    for (let item of data) {
      content += item.toString();
      if (first) {
        content += ': ';
        first = false;
      }
    }
    content += ', ';
  }

  content += `Chỉ số CK: ${hookProps.state.registerMeter}, Sai lệch: ${hookProps.state.deltaRegister}, Ghi chú: ${hookProps.userNote.value}\r\n`;

  try {
    const date = new Date();

    let nameFile =
      'Log_Read_Register_' +
      date.getDate() +
      '_' +
      date.getMonth() +
      '_' +
      date.getFullYear() +
      '.txt';
    const fullPath = PATH_EXPORT_LOG + '/' + nameFile;

    // const fileExist = await RNFS.exists(PATH_EXPORT_CSDL + '/' + nameFile);

    // if (fileExist) {
    //   await RNFS.appendFile(fullPath);
    // }

    console.log('content:', content);

    if (oldContent !== content) {
      await RNFS.appendFile(fullPath, content);

      hookProps.userNote.ref?.current?.clear();

      oldContent = content;

      showToast('Lưu thành công');
    } else {
      showToast('Đã lưu trước đó');
    }
  } catch (err) {
    showToast('Lưu thất bại:' + err.message);
  }
}

export function onDateStartPress(event: DateTimePickerEvent) {
  const date = new Date(event.nativeEvent.timestamp as number);
  const numberDate = date.getTime();
  const orDate = hookProps.state.dateStart.getTime();
  if (numberDate === orDate) {
    return;
  }
  hookProps.setState(state => {
    state.dateStart = date;
    return { ...state };
  });
}
export function onDateEndPress(event: DateTimePickerEvent) {
  const date = new Date(event.nativeEvent.timestamp as number);
  const numberDate = date.getTime();
  const orDate = hookProps.state.dateEnd.getTime();
  if (numberDate === orDate) {
    return;
  }
  hookProps.setState(state => {
    state.dateEnd = date;
    return { ...state };
  });
}
