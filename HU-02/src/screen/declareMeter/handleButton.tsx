import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {
  AddDeclareMeter,
  SendUnsentDeclareMeterProcess,
} from '../../database/service/declareMeterService';
import {AddMeter} from '../../service/api';
import {PropsAddMeter} from '../../service/api/index';
import {emitEventSuccess} from '../../service/event';
import {emitEventFailure} from '../../service/event/index';
import {showAlert} from '../../util';
import {isAllNumeric} from '../../util/index';
import {ListModelMeterObj, ListStationObj, hookProps} from './controller';

const TAG = 'Declare Meter Handle Button';

async function getGeolocation(): Promise<GeolocationResponse | null> {
  const rest = await new Promise<GeolocationResponse | null>(resolve => {
    Geolocation.getCurrentPosition(
      value => {
        resolve(value);
      },
      err => {
        console.log('err:', err);
        //showAlert(err.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 3600000,
      },
    );
  });
  return rest;
}

function checkCondition(): boolean {
  let text = '';
  if (!hookProps.state.infoDeclare.selectedStation) {
    showAlert('Chưa chọn trạm');
    return false;
  }
  if (!hookProps.state.infoDeclare.selectedModelMeter) {
    showAlert('Chưa chọn loại đồng hồ');
    return false;
  }
  text = hookProps.data.infoDeclare.seriMeter.trim();
  if (text.length !== 10 || isAllNumeric(text) === false) {
    showAlert('Số seri cơ khí không hợp lệ');
    return false;
  }
  text = hookProps.data.infoDeclare.customerName.trim();
  if (text.length === 0) {
    showAlert('Bổ sung thông tin Tên khách hàng');
    return false;
  }
  text = hookProps.data.infoDeclare.phoneNumber.trim();
  if (text.length > 0) {
    if (isAllNumeric(text) === false) {
      showAlert('Số điện thoại không hợp lệ');
      return false;
    }
  }

  return true;
}

export async function test() {
  //deleteDB();
  await SendUnsentDeclareMeterProcess();
  return;
}

export async function onDeclarePress() {
  let message = '';
  let succeeded = true;
  let saveDatabase = false;
  // const loacaion = await getGeolocation();
  // console.log('const loacaion = :', loacaion);
  // return;

  if (hookProps.state.isBusy) {
    return;
  }
  if (checkCondition() === false) {
    return;
  }

  const strSeri = hookProps.data.infoDeclare.seriMeter;
  const customerName = hookProps.data.infoDeclare.customerName;
  const customerCode = hookProps.data.infoDeclare.customerCode;
  const address = hookProps.data.infoDeclare.address;
  const phoneNumber = hookProps.data.infoDeclare.phoneNumber;
  const modelMeter = hookProps.state.infoDeclare.selectedModelMeter;

  try {
    hookProps.setState(state => {
      state.isBusy = true;
      state.status = 'Đang khai báo ...';
      return {...state};
    });
    const loacaion = await getGeolocation();

    //const location =

    const lineStatiobObj = ListStationObj.find(
      item => item.LINE_NAME === hookProps.state.infoDeclare.selectedStation,
    );
    const modelMeterObj = ListModelMeterObj.find(
      item => item.METER_MODEL_DESC === modelMeter,
    );

    if (lineStatiobObj && modelMeterObj) {
      const props: PropsAddMeter = {
        Coordinate: loacaion
          ? loacaion?.coords.latitude.toString() +
            ',' +
            loacaion?.coords.longitude.toString()
          : ' ',
        CustomerAddress: address,
        CustomerCode: customerCode,
        CustomerName: customerName,
        CustomerPhone: phoneNumber,
        LineID: lineStatiobObj.LINE_ID,
        MeterModelID: modelMeterObj.METER_MODEL_ID,
        MeterName: '',
        MeterNo: strSeri,
        SIM: '',
      };
      console.log('props:', props);

      const response = await AddMeter(props);
      if (response.bSucceeded === true) {
        message = 'Khai báo thành công ' + strSeri;

        // hookProps.setState(state => {
        //   state.infoDeclare.seriMeter = '';
        //   state.infoDeclare.customerName = '';
        //   state.infoDeclare.customerCode = '';
        //   state.infoDeclare.phoneNumber = '';
        //   return {...state};
        // });

        hookProps.data.infoDeclare.seriMeter = '';
        hookProps.data.infoDeclare.customerName = '';
        hookProps.data.infoDeclare.customerCode = '';
        hookProps.data.infoDeclare.phoneNumber = '';

        hookProps.refPhoneNUmber.current?.clear();
        hookProps.refSeriMeter.current?.clear();
        hookProps.refCustomerName.current?.clear();
        hookProps.refCustomerCode.current?.clear();
      } else {
        message = response.strMessage;
        succeeded = false;
        if (response.strMessage.trim() === 'Network Error') {
          saveDatabase = true;
          AddDeclareMeter(props);
          succeeded = true;
        }
      }
    } else {
      message = 'Không tìm thấy ID trạm ';
      succeeded = false;
    }
  } catch (err) {
    // setStatus(err.message);
    // hookProps.setState(state => {
    //   state.status = 'Lỗi: ' + err.message;
    //   return {...state};
    // });
    message = err.message;
  } finally {
    if (succeeded !== true && saveDatabase !== true) {
      showAlert(`
        Khai báo thất bại:

         seri: ${strSeri}
         KH: ${customerName}

         Lỗi: ${message}
        `);
      emitEventFailure();
    }
    if (succeeded === true && saveDatabase === false) {
      emitEventSuccess();
    }
    const date = new Date();
    hookProps.setState(state => {
      state.isBusy = false;
      state.status = message + ' ' + date.toLocaleTimeString('vi');
      return {...state};
    });
  }
}

export function onLineSelected(itemSelected: string) {
  hookProps.setState(state => {
    state.infoDeclare.selectedStation = itemSelected;
    return {...state};
  });
}
export function onModelMeterSelected(itemSelected: string) {
  hookProps.setState(state => {
    state.infoDeclare.selectedModelMeter = itemSelected;
    return {...state};
  });
}
