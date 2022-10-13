import {isNumeric} from '../../util';
import {PropsDatatable} from '../writeDataByBookCode/controller';
import {hookProps} from './controller';

export const checkCondition = (isManyPrice: boolean): boolean => {
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
  if (isManyPrice) {
    if (isNumeric(hookProps.state.Pmax) === false) {
      status += 'Pmax không hợp lệ ';
      res = false;
    } else {
      if (Number(hookProps.state.Pmax) <= 0) {
        status += 'Pmax phải lớn hơn 0 ';
        res = false;
      }
    }
    if (!hookProps.state.datePick) {
      status += 'Chưa chọn ngày Pmax ';
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

export const onWriteByHandDone = async (props: PropsDatatable) => {
  // hookProps.setState(state => {
  //   state.status = status;
  //   state.isWriting = true;
  //   return {...state};
  // });

  // const NO = props.data.SERY_CTO;
  // const loaiBCS = props.data.LOAI_BCS;
  // const RF = props.data.RF;
  // const isManyPrice = props.isManyPrice;

  // const writeDBSuccess = await updateDataToDB({
  //   seri: NO,
  //   BCSCMIS: loaiBCS,
  //   RfCode: RF,
  //   newCapacity: 0, // dont care
  //   oldCapacity: 0, // dont care
  //   date: new Date(),
  //   T0: hookProps.state.CS_Moi,
  //   Pmax: isManyPrice ? hookProps.state.Pmax : undefined,
  //   datePmax: isManyPrice ? formatDateTimeDB(hookProps.state.datePick) : '',
  //   isWriteHand: true,
  //   ghiChu:
  //     hookProps.state.ghichu.trim().length === 0
  //       ? undefined
  //       : hookProps.state.ghichu,
  // });

  // let status = '';

  // if (writeDBSuccess === true) {
  //   status = 'Ghi tay thành công ' + loaiBCS + ' của ' + NO;
  // } else {
  //   status = 'Ghi DB lỗi';
  // }

  // hookProps.setState(state => {
  //   state.status = status;
  //   state.isWriting = false;
  //   return {...state};
  // });

  console.log('not done');
};
