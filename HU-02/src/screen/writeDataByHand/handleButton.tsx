import {PushDataToServer} from '../../service/api';
import {updateDataToDB, updateSentToDb} from '../../service/database';
import {emitEventSuccess} from '../../service/event';
import {TYPE_READ_RF} from '../../service/hhu/defineEM';
import {formatDateTimeDB} from '../../service/hhu/util/utilFunc';
import {isNumeric} from '../../util';
import {PropsDataTable} from '../writeDataByStationCode/controller';
import {hookProps} from './controller';
import {emitEventFailure} from '../../service/event/index';

const TAG = 'Handle Btn Write Data By Hand';

export const checkCondition = (): boolean => {
  let status = '';
  let res = true;
  if (isNumeric(hookProps.state.CS_Moi) === false) {
    status += 'Chỉ số mới không hợp lệ ';
    res = false;
  } else {
    if (Number(hookProps.state.CS_Moi) <= 0) {
      status += 'Chỉ số mới phải lớn hơn 0 ';
      res = false;
    }
  }

  if (res === false) {
    hookProps.setState(state => {
      state.status = status;
      return {...state};
    });
    return false;
  } else {
    return true;
  }
};

export const onWriteByHandDone = async (props: PropsDataTable) => {
  hookProps.setState(state => {
    state.status = status;
    state.isWriting = true;
    return {...state};
  });

  const NO = props.data.NO_METER;
  const register = Number(hookProps.state.CS_Moi) * 1000;
  const data = [...props.data.DATA];
  data.push({
    time: formatDateTimeDB(new Date()),
    cwRegister: register,
    uCwRegister: 0,
  });
  const writeDBSuccess = await updateDataToDB({
    seri: NO,
    dateQuery: props.data.DATE_QUERY,
    data: data,
    typeRead: TYPE_READ_RF.WRITE_BY_HAND,
    note:
      hookProps.state.ghichu.trim().length === 0
        ? undefined
        : hookProps.state.ghichu,
  });
  try {
    let ret = await PushDataToServer({
      seri: NO,
      data: data,
    });
    if (ret) {
      console.log('sent to server successfully');
      ret = await updateSentToDb(NO, props.data.DATE_QUERY, true);
      if (ret) {
        console.log('updateSentToDb succeed');
      } else {
        console.log('updateSentToDb failed');
      }
    } else {
      console.log('sent to server failed');
    }
  } catch (err: any) {
    console.log(TAG, err.message);
  }

  let status = '';

  if (writeDBSuccess === true) {
    status = 'Ghi tay thành công seri ' + NO;
    emitEventSuccess();
  } else {
    status = 'Ghi DB lỗi';
    emitEventFailure();
  }

  hookProps.setState(state => {
    state.status = status;
    state.isWriting = false;
    return {...state};
  });
};
