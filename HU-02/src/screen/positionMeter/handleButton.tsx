import {GeolocationResponse} from '@react-native-community/geolocation';
import {
  AddMeter,
  GetMeter,
  PropsAddMeter,
  PropsGetMeterServer,
  SaveCoordinateMeter,
} from '../../service/api';
import {emitEventFailure, emitEventSuccess} from '../../service/event';
import {isAllNumeric, showAlert} from '../../util';
import {getGeolocation} from '../declareMeter/handleButton';
import {hook} from './controller';
import openMap, {createMapLink, createOpenLink} from 'react-native-open-maps';
import {AddDeclareMeter} from '../../database/service/declareMeterService';

const TAG = 'HandleButtonPositionMeter';

type PropsReturnSearchInfo = {
  bSucceed: boolean;
  latitude: number | undefined;
  longtitude: number | undefined;
};

export async function onSearchInfo(): Promise<PropsReturnSearchInfo> {
  const rest: PropsReturnSearchInfo = {
    bSucceed: false,
    latitude: undefined,
    longtitude: undefined,
  };
  let message = '';
  let bSuccess = true;
  const seri = hook.state.seri.trim();
  if (hook.state.isBusy) {
    return rest;
  }
  if (seri.length === 0) {
    showAlert('Chưa nhập số seri');
    return rest;
  }

  try {
    hook.setState(state => {
      state.isBusy = true;
      state.data.ADDRESS = '';
      state.data.COORDINATE = '';
      return {...state};
    });

    const rest1 = await GetMeter({
      Seri: seri,
    });

    if (rest1.bSucceeded) {
      const data = rest1.obj as PropsGetMeterServer;
      // hook.setState(
      //     state => {
      //         state.address = data.ADDRESS;
      //         state.gpsFromServer = data.COORDINATE;
      //         return {...state};
      //     }
      // );

      //   hook.state.data.ADDRESS = data.ADDRESS;
      //   hook.state.data.COORDINATE = data.COORDINATE;

      hook.state.data = data;

      console.log(TAG, 'data:', data);
      console.log(TAG, 'COORDINATE:', data.COORDINATE);

      if (data.METER_NO) {
        if (data.COORDINATE?.length > 5) {
          const arrLatitude = data.COORDINATE.split(',');
          rest.latitude = Number(arrLatitude[0]);
          rest.longtitude = Number(arrLatitude[1]);
          rest.bSucceed = true;
        }
      } else {
        bSuccess = false;
        message = 'Không có dữ liệu';
      }
    } else {
    }
  } catch (e) {
    console.log(TAG, 'error', e.message);
    message = e.message;
    bSuccess = false;
  } finally {
    hook.setState(state => {
      state.isBusy = false;
      if (bSuccess === false) {
        state.status = message;
      } else {
        state.status = '';
      }
      return {...state};
    });
  }

  return rest;
}

export async function onGoogleMapPress() {
  const rest = await onSearchInfo();

  console.log('rest:', rest);

  if (rest.bSucceed) {
    //console.log('haha');

    const link = createOpenLink({
      provider: 'google',
      // latitude: rest.latitude,
      // longitude: rest.longtitude,
      query: rest.latitude + ',' + rest.longtitude,
      zoom: 0,
      waypoints: [],
    });

    // console.log('link:', link);
    link();
  }
}

export async function onUpdateCoordinatePress() {
  let message = '';
  let bSuccess = true;
  let newCoordinate: string | undefined;
  const seri = hook.state.seri.trim();
  if (hook.state.isBusy) {
    return;
  }
  if (seri.length === 0) {
    showAlert('Chưa nhập số seri');
    return;
  }
  let ok = false;
  await showAlert(
    'Cập nhật toạ độ GPS cho đồng hồ hiện tại theo vị trí hiện tại ?',
    {
      label: 'Huỷ',
      func: () => {
        ok = false;
      },
    },

    {
      label: 'Cập nhật',
      func: () => {
        ok = true;
      },
    },
  );

  console.log('ok', ok);

  if (ok !== true) {
    return;
  }

  try {
    hook.setState(state => {
      state.isBusy = true;
      //   state.address = '';
      state.data.COORDINATE = '';
      return {...state};
    });

    let location: GeolocationResponse | null = null;
    for (let i = 0; i < 5; i++) {
      location = await getGeolocation();
      if (location === null || location.coords.accuracy > 22) {
        continue;
      } else {
        break;
      }
    }

    if (!location) {
      message = 'Lỗi GPS. Vui lòng thử lại';
      bSuccess = false;
    } else {
      newCoordinate =
        location.coords.latitude.toString() +
        ',' +
        location.coords.longitude.toString();
      const rest1 = await SaveCoordinateMeter({
        seri: seri,
        lat: location.coords.latitude.toString(),
        long: location.coords.longitude.toString(),
      });
      if (rest1) {
        message =
          'Cập nhật thành công toạ độ seri ' +
          seri +
          ' lúc ' +
          new Date().toLocaleTimeString();
      } else {
        message = 'Cập nhật thất bại';
      }
    }
  } catch (e) {
    console.log(TAG, 'error', e.message);
    message = e.message;
    bSuccess = false;
  } finally {
    hook.setState(state => {
      state.isBusy = false;
      state.status = message;
      state.data.COORDINATE = newCoordinate ?? '';
      return {...state};
    });
    if (bSuccess) {
      emitEventSuccess();
    } else {
      emitEventFailure();
    }
  }
}

function checkCondition(): boolean {
  let text = '';

  text = hook.state.seri;
  if (text.length !== 10 || isAllNumeric(text) === false) {
    showAlert('Số seri cơ khí không hợp lệ: độ dài phải bằng 10 và chỉ gồm số');
    return false;
  }
  text = hook.state.data.LINE_NAME;
  if (!text || text.length < 1) {
    showAlert('Không thể khai báo lại do đồng hồ này chưa từng được khai báo');
    return false;
  }
  text = hook.state.data.CUSTOMER_NAME.trim();
  if (text.length === 0) {
    showAlert('Bổ sung thông tin Tên khách hàng');
    return false;
  }
  text = hook.state.data.CUSTOMER_CODE.trim();
  if (text.length === 0) {
    showAlert('Bổ sung thông tin Mã khách hàng');
    return false;
  }
  text = hook.state.data.PHONE.trim();
  if (text.length > 0) {
    if (isAllNumeric(text) === false) {
      showAlert('Số điện thoại không hợp lệ');
      return false;
    }
  }

  return true;
}

export async function onReDecareMeter() {
  let message = '';
  let succeeded = true;
  let saveDatabase = false;
  // const loacaion = await getGeolocation();
  // console.log('const loacaion = :', loacaion);
  // return;

  if (hook.state.isBusy) {
    return;
  }
  if (checkCondition() === false) {
    return;
  }

  let ok = false;
  await showAlert(
    'Bạn có chắc muốn khai báo lại đồng hồ này ?',
    {
      label: 'Huỷ',
      func: () => {
        ok = false;
      },
    },

    {
      label: 'Khai báo lại',
      func: () => {
        ok = true;
      },
    },
  );

  console.log('ok', ok);

  if (ok !== true) {
    return;
  }

  await showAlert(
    'Thay đổi toạ độ GPS mới ?',
    {
      label: 'Giữ toạ độ cũ',
      func: () => {
        ok = false;
      },
    },

    {
      label: 'Lấy vị trí hiện tại',
      func: () => {
        ok = true;
      },
    },
  );

  try {
    const iSNewGPS: boolean = ok;

    hook.setState(state => {
      state.isBusy = true;
      state.status = 'Đang khai báo ...';
      return {...state};
    });

    let loacaion: GeolocationResponse | null = null;

    if (iSNewGPS) {
      loacaion = await getGeolocation();
      if (!loacaion) {
        message = 'Lỗi GPS. Vui lòng thử lại';
        succeeded = false;
        ok = false;
      } else {
        ok = true;
      }
    } else {
      ok = true;
    }

    if (ok) {
      //const location

      const data = hook.state.data;

      const strSeri = data.METER_NO;

      const coordinate = iSNewGPS
        ? loacaion
          ? loacaion?.coords.latitude.toString() +
            ',' +
            loacaion?.coords.longitude.toString()
          : data.COORDINATE
        : data.COORDINATE;

      if (true) {
        const props: PropsAddMeter = {
          Coordinate: coordinate,
          CustomerAddress: data.ADDRESS,
          CustomerCode: data.CUSTOMER_CODE,
          CustomerName: data.CUSTOMER_NAME,
          CustomerPhone: data.PHONE,
          LineID: data.LINE_ID,
          MeterModelID: data.METER_MODEL_ID,
          MeterName: '',
          MeterNo: strSeri,
          SIM: '',
        };
        console.log('props:', props);

        const response = await AddMeter(props);
        if (response.bSucceeded === true) {
          message = 'Khai báo lại thành công ' + strSeri;

          // hook.setState(state => {
          //   state.infoDeclare.seriMeter = '';
          //   state.infoDeclare.customerName = '';
          //   state.infoDeclare.customerCode = '';
          //   state.infoDeclare.phoneNumber = '';
          //   return {...state};
          // });
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
    }
  } catch (err) {
    // setStatus(err.message);
    // hook.setState(state => {
    //   state.status = 'Lỗi: ' + err.message;
    //   return {...state};
    // });
    message = 'Lỗi ' + err.message;
  } finally {
    if (succeeded !== true && saveDatabase !== true) {
      showAlert(`
        Khai báo thất bại:

         seri: ${hook.state.data.METER_NO}
         KH: ${hook.state.data.CUSTOMER_NAME}

         Lỗi: ${message}
        `);
      emitEventFailure();
    }
    if (succeeded === true && saveDatabase === false) {
      emitEventSuccess();
    }
    const date = new Date();
    hook.setState(state => {
      state.isBusy = false;
      state.status = message + ' ' + date.toLocaleTimeString('vi');
      return {...state};
    });
  }
}
