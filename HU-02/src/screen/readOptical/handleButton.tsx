import {Keyboard} from 'react-native';
import {ObjSend} from '../../service/hhu/Ble/hhuFunc';
import {
  FieldOpticalResponseProps,
  opticalSend,
  opticalShakeHand,
  waitOpticalAdvance,
} from '../../service/hhu/Optical/opticalFunc';
import {
  OPTICAL_CMD,
  Optical_HeaderProps,
  OPTICAL_TYPE_GET_DATA_DAILY,
  Rtc_CalendarProps,
  Rtc_CalendarType,
} from '../../service/hhu/Optical/opticalProtocol';
import {
  isAllNumeric,
  showToast,
  sleep,
  ByteArrayToString,
  BufferToString,
} from '../../util/util';
import {hookProps, store} from './controller';
import {Buffer} from 'buffer';
import {sizeof, Struct2Array} from '../../util/struct-and-array';
import {
  getUnitByLabel,
  getUnitByLabelOptical,
  PropsLabelOptical,
} from '../../service/hhu/util/utilFunc';
import {PropsLabel} from '../../service/hhu/defineWM';

export function setStatus(message: string) {
  hookProps.setState(state => {
    state.status = message;
    return {...state};
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

  hookProps.setState(state => {
    state.isReading = true;
    state.requestStop = false;
    state.seri = '';
    state.status = 'Đang đọc ...';
    state.dataTable = [];
    return {...state};
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
      }
    }
  }

  hookProps.setState(state => {
    state.isReading = false;
    if (state.status === 'Đang đọc ...') {
      state.status = '';
    }
    return {...state};
  });
  return;
}

function ConvertObjToHook(objResponse: any) {
  for (let itm in objResponse) {
    if (typeof objResponse[itm] === 'string') {
      hookProps.setState(state => {
        if ((itm as FieldOpticalResponseProps) === 'Seri') {
          state.seri = objResponse[itm];
        }
        state.dataTable.push([
          itm,
          objResponse[itm] + getUnitByLabelOptical(itm as PropsLabelOptical),
        ]);
        return {...state};
      });
    } else if (
      typeof objResponse[itm] === 'object' &&
      Array.isArray(objResponse[itm])
    ) {
      const dataTable: string[][] = [];
      for (let obj of objResponse[itm]) {
        for (let key in obj) {
          dataTable.push([
            key,
            obj[key] + getUnitByLabelOptical(key as PropsLabelOptical),
          ]);
        }
      }
      hookProps.setState(state => {
        state.dataTable = state.dataTable.concat(dataTable);
        return {...state};
      });
    }
  }
}

async function readInfo() {
  let bRet = await opticalShakeHand('00000000');
  if (!bRet) {
    setStatus('Bắt tay cổng quang lỗi');
    return;
  }

  const arrtypeData: OPTICAL_CMD[] = [];
  arrtypeData.push(OPTICAL_CMD.OPTICAL_GET_SERIAL);
  arrtypeData.push(OPTICAL_CMD.OPTICAL_GET_VERSION);
  arrtypeData.push(OPTICAL_CMD.OPTICAL_GET_MORE);
  arrtypeData.push(OPTICAL_CMD.OPTICAL_GET_RTC);

  const header = {} as Optical_HeaderProps;
  header.u8FSN = 0xff;
  header.u8Length = 0;

  let hasFailed = false;

  for (let cmd of arrtypeData) {
    header.u8Command = cmd;
    bRet = await opticalSend(header);
    if (bRet) {
      const response = await waitOpticalAdvance({
        desiredCmd: cmd,
        timeout: 2000,
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
    await sleep(150);
  }
  if (!hasFailed) {
    setStatus('Đọc xong');
  }
}

async function readData() {
  let bRet = await opticalShakeHand('00000000');
  if (!bRet) {
    setStatus('Bắt tay cổng quang lỗi');
    return;
  }

  const arrtypeData: OPTICAL_CMD[] = [];
  if (hookProps.state.seri === '') {
    arrtypeData.push(OPTICAL_CMD.OPTICAL_GET_SERIAL);
  }
  if (hookProps.state.typeRead === 'Tức thời') {
    arrtypeData.push(OPTICAL_CMD.OPTICAL_GET_REGISTER);
  } else {
    arrtypeData.push(OPTICAL_CMD.OPTICAL_GET_LIST_DATA_DAILY);
  }

  const header = {} as Optical_HeaderProps;
  header.u8FSN = 0xff;
  header.u8Length = 0;

  let hasFailed = false;

  for (let cmd of arrtypeData) {
    let payload: Buffer | undefined;
    let index = 0;
    header.u8Command = cmd;
    if (cmd === OPTICAL_CMD.OPTICAL_GET_LIST_DATA_DAILY) {
      if (hookProps.state.typeRead === 'Theo thời gian') {
        const calendar = {} as Rtc_CalendarProps;

        header.u8Length = 1 /*type get */ + 2 * sizeof(Rtc_CalendarType);
        payload = Buffer.alloc(header.u8Length);
        payload[index] = OPTICAL_TYPE_GET_DATA_DAILY.TYPE_GET_BY_TIME;
        index++;

        calendar.u16Year = hookProps.state.dateStart.getFullYear();
        calendar.u8Month = hookProps.state.dateStart.getMonth() + 1;
        calendar.u8DayOfMonth = hookProps.state.dateStart.getDate();
        calendar.u8Hours = hookProps.state.dateStart.getHours();
        calendar.u8Minutes = hookProps.state.dateStart.getMinutes();
        calendar.u8Seconds = hookProps.state.dateStart.getSeconds();

        Struct2Array(Rtc_CalendarType, calendar, payload, index);
        index += sizeof(Rtc_CalendarType);

        calendar.u16Year = hookProps.state.dateEnd.getFullYear();
        calendar.u8Month = hookProps.state.dateEnd.getMonth() + 1;
        calendar.u8DayOfMonth = hookProps.state.dateEnd.getDate();
        calendar.u8Hours = hookProps.state.dateEnd.getHours();
        calendar.u8Minutes = hookProps.state.dateEnd.getMinutes();
        calendar.u8Seconds = hookProps.state.dateEnd.getSeconds();

        Struct2Array(Rtc_CalendarType, calendar, payload, index);
        index += sizeof(Rtc_CalendarType);
      } else {
        header.u8Length = 2;
        payload = Buffer.alloc(header.u8Length);
        payload[index] = OPTICAL_TYPE_GET_DATA_DAILY.TYPE_GET_BY_NEAREST;
        index++;
        payload[index] = 10;
        index++;
      }
    }
    bRet = await opticalSend(header, payload);
    if (bRet) {
      const response = await waitOpticalAdvance({
        desiredCmd: cmd,
        timeout: 2000,
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
    await sleep(150);
  }
  if (!hasFailed) {
    setStatus('Đọc xong');
  }
}
