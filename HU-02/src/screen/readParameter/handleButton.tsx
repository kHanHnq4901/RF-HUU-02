import {Keyboard} from 'react-native';
import {ObjSend} from '../../service/hhu/Ble/hhuFunc';
import {PropsLabel} from '../../service/hhu/defineWM';
import {
  PropsModelRadio,
  PropsRead,
  RfFunc_Read,
} from '../../service/hhu/RF/RfFunc';
import {getUnitByLabel} from '../../service/hhu/util/utilFunc';
import {isAllNumeric, showToast} from '../../util';
import * as controller from './controller';
import {hookProps, store} from './controller';

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
              }
            }
          }
        }

        //console.log('rows:', rows);
        hookProps.setState(state => {
          state.status = 'Đọc thành công ' + controller.hookProps.state.seri;
          state.dataTable = [...state.dataTable, ...rows];
          //console.log('ok here');
          return {...state};
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
          return {...state};
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

  hookProps.setState(state => {
    state.isReading = true;
    state.requestStop = false;
    state.status = 'Đang đọc ...';
    state.dataTable = [];
    return {...state};
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
    return {...state};
  });
  return;
};
