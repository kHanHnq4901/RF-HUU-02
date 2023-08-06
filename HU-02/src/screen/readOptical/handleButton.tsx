import { Buffer } from 'buffer';
import { Keyboard } from 'react-native';
import { ObjSend } from '../../service/hhu/Ble/hhuFunc';
import {
  FieldOpticalResponseProps,
  opticalSend,
  opticalShakeHand,
  waitOpticalAdvance,
} from '../../service/hhu/Optical/opticalFunc';
import {
  OPTICAL_CMD,
  OPTICAL_TYPE_GET_DATA_DAILY,
  Optical_HeaderProps,
  Optical_SeriType,
  Rtc_CalendarProps,
  Rtc_CalendarType,
} from '../../service/hhu/Optical/opticalProtocol';
import {
  PropsLabelOptical,
  getUnitByLabelOptical,
} from '../../service/hhu/util/utilFunc';
import { USER_ROLE_TYPE } from '../../service/user';
import { showAlert, showToast, sleep } from '../../util';
import { Struct2Array, sizeof } from '../../util/struct-and-array';
import { hookProps } from './controller';
import { store } from '../../component/drawer/drawerContent/controller';
import RNFS from 'react-native-fs';
import { log } from 'react-native-reanimated';
import { PATH_EXPORT_LOG } from '../../shared/path';
import { GeolocationResponse } from '@react-native-community/geolocation';
import { getGeolocation } from '../declareMeter/handleButton';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const TAG = 'Handle Btn Read Optical';

export function setStatus(message: string) {
  hookProps.setState(state => {
    state.status = message;
    return { ...state };
  });
}

function checkCondition(): boolean {
  if (store.state.hhu.connect !== 'CONNECTED') {
    showToast('Chưa kết nối bluetooth');
    return false;
  }
  if (ObjSend.isShakeHanded !== true) {
    showToast('Chưa bắt tay được bluetooth');
    return false;
  }

  if (hookProps.state.typeRead === 'Theo thời gian') {
    const startTime = hookProps.state.dateStart.getTime();
    const endTime = hookProps.state.dateEnd.getTime();
    if (startTime > endTime) {
      showToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return false;
    }
  }
  let hasItem = false;
  for (let itm of hookProps.state.typeData.items) {
    if (itm.checked === true) {
      hasItem = true;
      break;
    }
  }
  if (!hasItem) {
    showToast('Chưa chọn loại đọc');
    return false;
  }
  return true;
}

export async function onBtnReadPress() {
  Keyboard.dismiss();
  if (checkCondition() === false) {
    return;
  }

  try {
    hookProps.setState(state => {
      state.isReading = true;
      state.requestStop = false;
      state.seri = '';
      state.status = 'Đang đọc ...';
      state.dataTable = [];
      return { ...state };
    });

    for (let itm of hookProps.state.typeData.items) {
      if (itm.checked) {
        switch (itm.value) {
          case 'Thông tin':
            await readInfo();
            break;
          case 'Dữ liệu':
            await readData();
            break;
          case 'Sensor':
            await readSensor();
            break;
          case 'Thời gian gửi':
            await readTimeSend();
            break;
          case 'Nbiot':
            await testRF();
            break;
        }
      }
    }
  } catch (err: any) {
    console.log(TAG, 'Error:', err.message);
  } finally {
    hookProps.setState(state => {
      state.isReading = false;
      if (state.status === 'Đang đọc ...') {
        state.status = '';
      }
      return { ...state };
    });
  }

  return;
}

function ConvertObjToHook(objResponse: any) {
  for (let itm in objResponse) {
    if (typeof objResponse[itm] === 'string') {
      hookProps.setState(state => {
        if ((itm as FieldOpticalResponseProps) === 'Seri đồng hồ') {
          state.seri = objResponse[itm];
        }
        if (objResponse[itm]) {
          state.dataTable.push([
            itm,
            objResponse[itm] + getUnitByLabelOptical(itm as PropsLabelOptical),
          ]);
        }

        return { ...state };
      });
    } else if (
      typeof objResponse[itm] === 'object' &&
      Array.isArray(objResponse[itm])
    ) {
      const dataTable: string[][] = [];
      for (let obj of objResponse[itm]) {
        for (let key in obj) {
          if (obj[key]) {
            dataTable.push([
              key,
              obj[key] + getUnitByLabelOptical(key as PropsLabelOptical),
            ]);
          }
        }
      }

      hookProps.setState(state => {
        state.dataTable = state.dataTable.concat(dataTable);
        return { ...state };
      });
    }
  }
  console.log('dataTable:', hookProps.state.dataTable);
}

async function commonRead(arrCommand: OPTICAL_CMD[]) {
  let bRet = await opticalShakeHand('00000000');
  if (!bRet) {
    setStatus('Bắt tay cổng quang lỗi');
    return;
  }

  let typeSeri = 0xff;

  const header = {} as Optical_HeaderProps;
  header.u8FSN = 0xff;
  header.u8Length = 0;

  let hasFailed = false;
  let payload: Buffer | undefined;
  let timeout: number = 0;
  for (let cmd of arrCommand) {
    console.log('get cmd:', cmd);

    header.u8Command = cmd;
    timeout = 2000;
    if (cmd === OPTICAL_CMD.OPTICAL_GET_SERIAL) {
      payload = Buffer.alloc(1);
      if (typeSeri === 0xff) {
        typeSeri = Optical_SeriType.OPTICAL_TYPE_SERI_METER;
      } else {
        typeSeri = Optical_SeriType.OPTICAL_TYPE_SERI_MODULE;
      }
      payload[0] = typeSeri; // first meter then module
      header.u8Length = payload.byteLength;
    }
    if (cmd === OPTICAL_CMD.OPTICAL_TEST_RF) {
      payload = Buffer.alloc(1);
      payload[0] = 1; // test RF online
      header.u8Length = payload.byteLength;
      timeout = 45000;
    }
    bRet = await opticalSend(header, payload);
    if (bRet) {
      const response = await waitOpticalAdvance({
        desiredCmd: cmd,
        timeout: timeout,
      });
      if (response.bSucceed) {
        console.log(response.obj);
      } else {
        setStatus(response.message);
        hasFailed = true;
      }
      if (response.obj) {
        ConvertObjToHook(response.obj);
      }
    }
    payload = undefined;
    header.u8Length = 0;
    await sleep(200);
  }
  if (!hasFailed) {
    setStatus('Đọc xong');
  }
}

async function readInfo() {
  const arrCommand: OPTICAL_CMD[] = [];

  arrCommand.push(OPTICAL_CMD.OPTICAL_GET_VERSION);
  arrCommand.push(OPTICAL_CMD.OPTICAL_GET_SERIAL); // meter
  arrCommand.push(OPTICAL_CMD.OPTICAL_GET_SERIAL); // module

  arrCommand.push(OPTICAL_CMD.OPTICAL_GET_MORE);
  arrCommand.push(OPTICAL_CMD.OPTICAL_GET_RTC);

  if (
    store.state.userInfo.USER_TYPE === USER_ROLE_TYPE.ADMIN ||
    store.state.userInfo.USER_TYPE === USER_ROLE_TYPE.STAFF
  ) {
    arrCommand.push(OPTICAL_CMD.OPTICAL_GET_ERROR_SYSTEM);
  }

  await commonRead(arrCommand);
}

async function readSensor() {
  const arrCommand: OPTICAL_CMD[] = [];

  arrCommand.push(OPTICAL_CMD.OPTICAL_GET_SENSOR_OBJ_INDIRECT_LC);

  await commonRead(arrCommand);
}

async function readData() {
  let bRet = await opticalShakeHand('00000000');
  if (!bRet) {
    setStatus('Bắt tay cổng quang lỗi');
    return;
  }

  const arrCommand: OPTICAL_CMD[] = [];
  //if (hookProps.state.seri === '') {
  arrCommand.push(OPTICAL_CMD.OPTICAL_GET_SERIAL);
  //}
  if (hookProps.state.typeRead === 'Tức thời') {
    arrCommand.push(OPTICAL_CMD.OPTICAL_GET_REGISTER);
  } else {
    arrCommand.push(OPTICAL_CMD.OPTICAL_GET_LIST_DATA_DAILY);
  }

  const header = {} as Optical_HeaderProps;
  header.u8FSN = 0xff;
  header.u8Length = 0;

  let hasFailed = false;

  for (let cmd of arrCommand) {
    let payload: Buffer | undefined;
    let index = 0;
    header.u8Command = cmd;
    if (cmd === OPTICAL_CMD.OPTICAL_GET_SERIAL) {
      payload = Buffer.alloc(1);
      payload[0] = Optical_SeriType.OPTICAL_TYPE_SERI_METER;
      header.u8Length = 1;
    } else if (cmd === OPTICAL_CMD.OPTICAL_GET_LIST_DATA_DAILY) {
      if (hookProps.state.typeRead === 'Theo thời gian') {
        const calendar = {} as Rtc_CalendarProps;

        header.u8Length =
          1 /*type get */ + 1 /** is0h */ + 2 * sizeof(Rtc_CalendarType);
        payload = Buffer.alloc(header.u8Length);
        payload[index] = OPTICAL_TYPE_GET_DATA_DAILY.TYPE_GET_BY_TIME;
        index++;
        if (hookProps.state.is0h === true) {
          payload[index] = 1;
        } else {
          payload[index] = 0;
        }
        index++;

        calendar.u16Year = hookProps.state.dateStart.getFullYear();
        calendar.u8Month = hookProps.state.dateStart.getMonth() + 1;
        calendar.u8DayOfMonth = hookProps.state.dateStart.getDate();
        calendar.u8Hours = hookProps.state.dateStart.getHours();
        calendar.u8Minutes = hookProps.state.dateStart.getMinutes();
        calendar.u8Seconds = hookProps.state.dateStart.getSeconds();

        console.log('start time: ', calendar);

        Struct2Array(Rtc_CalendarType, calendar, payload, index);
        index += sizeof(Rtc_CalendarType);

        calendar.u16Year = hookProps.state.dateEnd.getFullYear();
        calendar.u8Month = hookProps.state.dateEnd.getMonth() + 1;
        calendar.u8DayOfMonth = hookProps.state.dateEnd.getDate();
        calendar.u8Hours = hookProps.state.dateEnd.getHours();
        calendar.u8Minutes = hookProps.state.dateEnd.getMinutes();
        calendar.u8Seconds = hookProps.state.dateEnd.getSeconds();

        console.log('end time: ', calendar);

        Struct2Array(Rtc_CalendarType, calendar, payload, index);
        index += sizeof(Rtc_CalendarType);
      } else {
        header.u8Length = 3; /** type get + is 0h + num nearest */
        payload = Buffer.alloc(header.u8Length);
        payload[index] = OPTICAL_TYPE_GET_DATA_DAILY.TYPE_GET_BY_NEAREST;
        index++;
        if (hookProps.state.is0h === true) {
          payload[index] = 1;
        } else {
          payload[index] = 0;
        }
        index++;
        payload[index] = 10;
        index++;
      }
    } else {
      header.u8Length = 0;
    }
    bRet = await opticalSend(header, payload);
    if (bRet) {
      const response = await waitOpticalAdvance({
        desiredCmd: cmd,
        timeout: 5000,
      });
      if (response.bSucceed) {
      } else {
        setStatus(response.message);
        hasFailed = true;
      }
      if (response.obj) {
        ConvertObjToHook(response.obj);
      }
    }
    await sleep(200);
  }
  if (!hasFailed) {
    setStatus('Đọc xong');
  }
}

async function testRF() {
  const arrCommand: OPTICAL_CMD[] = [];
  arrCommand.push(OPTICAL_CMD.OPTICAL_GET_SERIAL); // test RF online
  arrCommand.push(OPTICAL_CMD.OPTICAL_GET_SERIAL); // test RF online
  arrCommand.push(OPTICAL_CMD.OPTICAL_GET_ACTIVE_RADIO); // test RF online
  arrCommand.push(OPTICAL_CMD.OPTICAL_TEST_RF); // test RF online

  await commonRead(arrCommand);
}

async function readTimeSend() {
  let bRet = await opticalShakeHand('00000000');
  if (!bRet) {
    setStatus('Bắt tay cổng quang lỗi');
    return;
  }

  const arrCommand: OPTICAL_CMD[] = [];
  arrCommand.push(OPTICAL_CMD.OPTICAL_GET_SERIAL); // meter
  arrCommand.push(OPTICAL_CMD.OPTICAL_GET_TIME_SEND);

  const header = {} as Optical_HeaderProps;
  header.u8FSN = 0xff;
  header.u8Length = 0;

  let hasFailed = false;

  for (let cmd of arrCommand) {
    let payload: Buffer | undefined;
    let index = 0;
    header.u8Command = cmd;
    if (cmd === OPTICAL_CMD.OPTICAL_GET_SERIAL) {
      payload = Buffer.alloc(1);
      payload[0] = Optical_SeriType.OPTICAL_TYPE_SERI_METER;
      header.u8Length = 1;
    } else {
      payload = undefined;
      header.u8Length = 0;
    }
    bRet = await opticalSend(header, payload);
    if (bRet) {
      const response = await waitOpticalAdvance({
        desiredCmd: cmd,
        timeout: 5000,
      });
      if (response.bSucceed) {
      } else {
        setStatus(response.message);
        hasFailed = true;
      }
      if (response.obj) {
        ConvertObjToHook(response.obj);
      }
    }
    await sleep(200);
  }
  if (!hasFailed) {
    setStatus('Đọc xong');
  }
}

export async function onGetPosition(): Promise<GeolocationResponse | null> {
  // const rest = await onSearchInfo();

  // console.log('rest:', rest);
  let location: GeolocationResponse | null = null;
  for (let i = 0; i < 5; i++) {
    console.log('i:', i);

    location = await getGeolocation();
    if (location === null || location.coords.accuracy > 20) {
      continue;
    } else {
      if (location?.coords.longitude && location?.coords.latitude) {
        return location;
      }

      break;
    }
  }
  return null;
}

let oldContent = '';

export async function onSaveLogPress() {
  let content = '';

  if (hookProps.state.isSaving) {
    showToast('Đang lưu');
    return;
  }

  if (!hookProps.state.dataTable.length) {
    showAlert('Chưa có dữ liệu');
    // console.log(
    //   'hookProps.state.dataTable.length:',
    //   hookProps.state.dataTable.length,
    // );

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
  let getPositionSucceed = true;
  try {
    hookProps.setState(state => {
      state.isSaving = true;
      return { ...state };
    });
    const pos = await onGetPosition();
    if (!pos || !pos?.coords?.latitude || !pos?.coords?.longitude) {
      throw new Error('Không thể lấy vị trí hiện tại, hãy thử lại ...');
    }
    content += 'LatLog: ' + pos?.coords.latitude + ',' + pos?.coords.longitude;
    console.log('here1');
  } catch (err: any) {
    console.log('err:', err.message);
    getPositionSucceed = false;
    showAlert('Lấy vị trí thất baị:', err.message);
    hookProps.setState(state => {
      state.isSaving = false;
      return { ...state };
    });
  } finally {
    console.log('here2');

    // isBusy =
  }
  if (getPositionSucceed === false) {
    return;
  }
  console.log('here3');

  content += '\r\n';

  // content += `Chỉ số CK: ${hookProps.state.registerMeter}, Sai lệch: ${hookProps.state.deltaRegister}, Ghi chú: ${hookProps.userNote.value}\r\n`;

  try {
    const date = new Date();

    let nameFile =
      'Log_Read_Optical_' +
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

    if (oldContent !== content) {
      oldContent = content;
      await RNFS.appendFile(fullPath, content);

      showToast('Lưu thành công');
    } else {
      showToast('Đã lưu trước đó');
    }

    console.log('content:', content);
  } catch (err) {
    showToast('Lưu thất bại:' + err.message);
  } finally {
    hookProps.setState(state => {
      state.isSaving = false;
      return { ...state };
    });
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
