import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {AddMeter} from '../../service/api';
import {showAlert} from '../../util';
import {isAllNumeric} from '../../util/index';
import {ListModelMeterObj, ListStationObj, hookProps} from './controller';

const TAG = 'Declare Meter Handle Button';

async function getGeolocation(): Promise<GeolocationResponse | null> {
  const rest = await new Promise<GeolocationResponse | null>(
    (resolve, reject) => {
      Geolocation.getCurrentPosition(
        value => {
          resolve(value);
        },
        err => {
          console.log('err:', err);
          //showAlert(err.message);
          reject(null);
        },
        {
          enableHighAccuracy: true,
        },
      );
    },
  );
  return rest;
}

function checkCondition(): boolean {
  if (!hookProps.state.infoDeclare.selectedStation) {
    showAlert('Chưa chọn trạm');
    return false;
  }
  if (!hookProps.state.infoDeclare.selectedModelMeter) {
    showAlert('Chưa chọn loại đồng hồ');
    return false;
  }
  if (
    hookProps.state.infoDeclare.seriMeter.length <= 5 ||
    isAllNumeric(hookProps.state.infoDeclare.seriMeter) === false
  ) {
    showAlert('Số seri cơ khí không hợp lệ');
    return false;
  }
  if (hookProps.state.infoDeclare.customerName.length === 0) {
    showAlert('Bổ sung thông tin Tên khách hàng');
    return false;
  }
  if (hookProps.state.infoDeclare.phoneNumber.length > 0) {
    if (isAllNumeric(hookProps.state.infoDeclare.phoneNumber) === false) {
      showAlert('Số điện thoại không hợp lệ');
      return false;
    }
  }

  return true;
}

export async function onDeclarePress() {
  let message = '';
  const loacaion = await getGeolocation();
  console.log('const loacaion = :', loacaion);
  return;
  try {
    if (hookProps.state.isBusy) {
      return;
    }
    if (checkCondition() === false) {
      return;
    }
    hookProps.setState(state => {
      state.isBusy = true;
      state.status = 'Đang khai báo ...';
      return {...state};
    });
    const loacaion = await getGeolocation();
    const strSeri = hookProps.state.infoDeclare.seriMeter;
    const customerName = hookProps.state.infoDeclare.customerName;
    const customerCode = hookProps.state.infoDeclare.customerCode;
    const address = hookProps.state.infoDeclare.address;
    const phoneNumber = hookProps.state.infoDeclare.phoneNumber;
    const modelMeter = hookProps.state.infoDeclare.selectedModelMeter;
    //const location =

    const lineStatiobObj = ListStationObj.find(
      item => item.LINE_NAME === hookProps.state.infoDeclare.selectedStation,
    );
    const modelMeterObj = ListModelMeterObj.find(
      item => item.METER_MODEL_DESC === modelMeter,
    );

    if (lineStatiobObj && modelMeterObj) {
      const response = await AddMeter({
        Coordinate:
          loacaion?.coords.latitude.toString() +
          ',' +
          loacaion?.coords.longitude.toString,
        CustomerAddress: address,
        CustomerCode: customerCode,
        CustomerName: customerName,
        CustomerPhone: phoneNumber,
        LineID: lineStatiobObj.LINE_ID,
        MeterModelID: modelMeterObj.METER_MODEL_ID,
        MeterName: '',
        MeterNo: strSeri,
        SIM: '',
      });
      if (response.bSucceeded === true) {
        message = 'Khai báo thành công ' + strSeri;
      } else {
        message = 'Khai báo thất bại: ' + response.strMessage;
      }
    } else {
      message = 'Không tìm thấy ID trạm ';
    }
  } catch (err) {
    // setStatus(err.message);
    // hookProps.setState(state => {
    //   state.status = 'Lỗi: ' + err.message;
    //   return {...state};
    // });
    message = err.message;
  } finally {
    hookProps.setState(state => {
      state.isBusy = false;
      state.status = message;
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
