import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import { createOpenLink } from 'react-native-open-maps';
import {
  AddDeclareMeter,
  SendUnsentDeclareMeterProcess,
} from '../../database/service/declareMeterService';
import { AddMeter, GetMeter, PropsGetMeterServer } from '../../service/api';
import { PropsAddMeter } from '../../service/api/index';
import { emitEventSuccess } from '../../service/event';
import { emitEventFailure } from '../../service/event/index';
import { showAlert, showToast } from '../../util';
import { isAllNumeric } from '../../util/index';
import { Region } from 'react-native-maps';
import { hookProps } from './controller';
import { deleteFile } from '../../shared/file';

const TAG = 'Declare Meter Handle Button';

type PropsReturnSearchInfo = {
  bSucceed: boolean;
  latitude: number | undefined;
  longtitude: number | undefined;
};

export async function getGeolocation(): Promise<GeolocationResponse | null> {
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
        timeout: 5000,
        maximumAge: 3600000,
      },
    );
  });
  console.log('accuracy:', rest?.coords.accuracy);

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
  text = hookProps.state.data.METER_NO.trim();
  if (text.length !== 10 || isAllNumeric(text) === false) {
    showAlert('Số seri cơ khí không hợp lệ: độ dài phải bằng 10 và chỉ gồm số');
    return false;
  }
  // text = hookProps.data.infoDeclare.customerName.trim();
  // if (text.length === 0) {
  //   showAlert('Bổ sung thông tin Tên khách hàng');
  //   return false;
  // }
  text = hookProps.state.data.CUSTOMER_CODE.trim();
  if (text.length === 0) {
    showAlert('Bổ sung thông tin Mã khách hàng');
    return false;
  }
  text = hookProps.state.data.PHONE?.trim() ?? '';
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

  let ok = true;
  await showAlert(
    'Bạn có chắc vị trí hiện tại ?',
    {
      label: 'OK',
      func: () => {
        ok = true;
      },
    },
    {
      label: 'Huỷ',
      func: () => {
        ok = false;
      },
    },
  );

  if (ok) {
  } else {
    return;
  }

  const strSeri = hookProps.state.data.METER_NO;
  const customerName = hookProps.state.data.CUSTOMER_NAME;
  const customerCode = hookProps.state.data.CUSTOMER_CODE;
  const address = hookProps.state.data.ADDRESS;
  const phoneNumber = hookProps.state.data.PHONE;
  const modelMeter = hookProps.state.infoDeclare.selectedModelMeter ?? '';

  try {
    let ok = false;
    await showAlert(
      'Thay đổi toạ độ GPS mới ?',
      {
        label: 'Giữ toạ độ cũ',
        func: () => {
          ok = false;
        },
      },

      {
        label: 'Lấy vị trí trên bản đồ',
        func: () => {
          ok = true;
        },
      },
    );

    const iSNewGPS: boolean = ok;

    hookProps.setState(state => {
      state.isBusy = true;
      state.status = 'Đang khai báo ...';
      return { ...state };
    });
    // let location: GeolocationResponse | null = null;

    if (iSNewGPS) {
      // for (let i = 0; i < 5; i++) {
      //   location = await getGeolocation();
      //   if (location === null || location.coords.accuracy > 20) {
      //     ok = false;
      //     message = 'Lỗi GPS. Vui lòng thử lại';
      //     succeeded = false;
      //     continue;
      //   } else {
      //     ok = true;
      //     break;
      //   }
      // }
      ok = true;
    } else {
      ok = true;
    }

    if (!ok) {
      // message = 'Lỗi GPS. Vui lòng thử lại';
      succeeded = false;
    } else {
      //const location =

      const coordinate = iSNewGPS
        ? hookProps.state.region.latitude +
          ',' +
          hookProps.state.region.longitude
        : hookProps.state.data.COORDINATE;

      const lineStatiobObj = hookProps.state.listStationObj.find(
        item => item.LINE_NAME === hookProps.state.infoDeclare.selectedStation,
      );
      const modelMeterObj = hookProps.state.listModelMeterObj.find(item =>
        item.METER_MODEL_DESC.includes(modelMeter),
      );

      if (lineStatiobObj && modelMeterObj) {
        const props: PropsAddMeter = {
          Coordinate: coordinate,
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

          hookProps.state.data.METER_NO = '';
          hookProps.state.data.CUSTOMER_NAME = '';
          hookProps.state.data.CUSTOMER_CODE = '';
          hookProps.state.data.ADDRESS = '';
          hookProps.state.data.PHONE = '';
          for (let image of hookProps.state.images) {
            if (image.uri) {
              await deleteFile(image.uri);
            }
          }
          hookProps.state.images = [];

          // hookProps.refPhoneNUmber.current?.clear();
          // hookProps.refSeriMeter.current?.clear();
          // hookProps.refCustomerName.current?.clear();
          // hookProps.refCustomerCode.current?.clear();

          hookProps.refScroll.current?.scrollTo(0);
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
    console.log('abc:', succeeded === true && saveDatabase === false);

    if (succeeded === true && saveDatabase === false) {
      console.log('emit event success');

      emitEventSuccess();
    }
    const date = new Date();
    hookProps.setState(state => {
      state.isBusy = false;
      state.status = message + ' ' + date.toLocaleTimeString('vi');
      return { ...state };
    });
  }
}

export function onLineSelected(itemSelected: string) {
  hookProps.setState(state => {
    state.infoDeclare.selectedStation = itemSelected;
    return { ...state };
  });
}
export function onModelMeterSelected(itemSelected: string) {
  hookProps.setState(state => {
    state.infoDeclare.selectedModelMeter = itemSelected;
    return { ...state };
  });
}

export async function onSearchInfo(): Promise<PropsReturnSearchInfo> {
  const rest: PropsReturnSearchInfo = {
    bSucceed: false,
    latitude: undefined,
    longtitude: undefined,
  };
  let message = '';
  let bSuccess = true;
  const seri = hookProps.state.data.METER_NO.trim();
  if (hookProps.state.isBusy) {
    return rest;
  }
  if (seri.length === 0) {
    showAlert('Chưa nhập số seri');
    return rest;
  }

  try {
    hookProps.setState(state => {
      state.isBusy = true;
      state.data = {} as PropsGetMeterServer;
      state.data.METER_NO = seri;

      return { ...state };
    });

    const rest1 = await GetMeter({
      Seri: seri,
    });

    if (rest1.bSucceeded) {
      const data = rest1.obj as PropsGetMeterServer;
      // hookProps.setState(
      //     state => {
      //         state.address = data.ADDRESS;
      //         state.gpsFromServer = data.COORDINATE;
      //         return {...state};
      //     }
      // );

      //   hookProps.state.data.ADDRESS = data.ADDRESS;
      //   hookProps.state.data.COORDINATE = data.COORDINATE;

      // console.log(TAG, 'data:', data);
      console.log(TAG, 'COORDINATE:', data.COORDINATE);

      if (data.METER_NO) {
        const indexStation = hookProps.state.lisStationName.findIndex(
          item => item === data.LINE_NAME,
        );
        console.log('indexStation:', indexStation);
        if (indexStation !== -1) {
          hookProps.refStation?.current?.selectIndex(indexStation);
        } else {
          throw new Error('Đồng hồ không thuộc danh sách quản lý');
        }
        hookProps.state.data = data;
        hookProps.state.infoDeclare.selectedModelMeter =
          data.METER_MODEL_DESC.slice(4);
        hookProps.state.infoDeclare.selectedStation = data.LINE_NAME;

        const indexMeterModel = hookProps.state.listModelMeterObj.findIndex(
          item => item.METER_MODEL_DESC === data.METER_MODEL_DESC,
        );
        // console.log('listModelMeterName:', listModelMeterName);
        // console.log('data.METER_MODEL_DESC:', data.METER_MODEL_DESC);
        console.log('indexMeterModel:', indexMeterModel);

        if (indexMeterModel !== -1) {
          // console.log(
          //   'indexMeterModel:',
          //   hookProps.refModelMeter?.current?.selectIndex,
          // );
          hookProps.refModelMeter?.current?.selectIndex(indexMeterModel);
        }
        if (data.COORDINATE?.length > 5) {
          const arrLatitude = data.COORDINATE.split(',');
          rest.latitude = Number(arrLatitude[0]);
          rest.longtitude = Number(arrLatitude[1]);

          const region = { ...hookProps.state.region };
          const position = { ...hookProps.state.position };

          region.latitude = rest.latitude;
          region.longitude = rest.longtitude;

          position.latitude = rest.latitude;
          position.longitude = rest.longtitude;

          hookProps.state.region = region;

          hookProps.state.position = position;

          console.log(TAG, 'COORDINATE:', hookProps.state.region);

          rest.bSucceed = true;
        } else {
          hookProps.state.position = null;
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
    hookProps.setState(state => {
      state.isBusy = false;
      if (bSuccess === false) {
        state.status = message;
      } else {
        state.status = '';
      }
      return { ...state };
    });
  }

  return rest;
}

export async function onGoogleMapPress() {
  // const rest = await onSearchInfo();

  // console.log('rest:', rest);

  if (hookProps.state.data.COORDINATE) {
    const link = createOpenLink({
      provider: 'google',
      // latitude: rest.latitude,
      // longitude: rest.longtitude,
      query:
        hookProps.state.region.latitude +
        ',' +
        hookProps.state.region.longitude,
      zoom: 0,
      waypoints: [],
    });
    link();
  } else {
    showAlert('Không có dữ liệu');
  }
}

async function getCurrentPosition(): Promise<GeolocationResponse | null> {
  let location: GeolocationResponse | null = null;
  for (let i = 0; i < 5; i++) {
    location = await getGeolocation();
    if (i !== 4 && (location === null || location.coords.accuracy > 100)) {
      continue;
    } else {
      if (location?.coords.longitude && location?.coords.latitude) {
        return location;
      }

      break;
    }
  }
  return location;
}

export async function onGetPositionPress() {
  // const rest = await onSearchInfo();

  // console.log('rest:', rest);
  let location: GeolocationResponse | null = null;
  for (let i = 0; i < 5; i++) {
    location = await getGeolocation();
    if (i !== 4 && (location === null || location.coords.accuracy > 100)) {
      continue;
    } else {
      if (location?.coords.longitude && location?.coords.latitude) {
        hookProps.setState(state => {
          const position = { ...state.position };
          const region = { ...state.region };

          position.latitude = location.coords.latitude;
          position.longitude = location.coords.longitude;

          region.latitude = position.latitude;
          region.longitude = position.longitude;

          console.log('region:', region);

          state.position = position;
          state.region = region;
          return { ...state };
        });
        showToast('Đã cập nhật toạ độ hiện tại');
        return;
      }

      break;
    }
  }
}

export function onRegionChangeComplete(region: Region) {
  console.log('region:', region);
  hookProps.setState(state => {
    state.region = { ...region };
    return { ...state };
  });
}
