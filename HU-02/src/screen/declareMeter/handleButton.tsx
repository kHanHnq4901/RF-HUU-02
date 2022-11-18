import {DeclareMeter} from '../../service/api';
import {hookProps, setStatus} from './controller';
import Geolocation from '@react-native-community/geolocation';
import {showAlert} from '../../util';

const TAG = 'Declare Meter Handle Button';

export async function onDeclarePress() {
  try {
    hookProps.setState(state => {
      state.isBusy = true;
      state.status = 'Đang khai báo ...';
      return {...state};
    });
    const strSeri = hookProps.state.seri.trim();
    Geolocation.getCurrentPosition(
      async value => {
        const seri = strSeri;
        const lat = value.coords.latitude.toString();
        const long = value.coords.longitude.toString();
        const ok = await DeclareMeter({
          seri: seri,
          lat: lat,
          long: long,
        });
        let status = '';
        if (ok) {
          status = 'Khai báo thành công seri : ';
          //setStatus('Khai báo thành công');
        } else {
          status = 'Khai báo thất bại seri: ';
          //setStatus('Khai báo thất bại');
        }

        hookProps.setState(state => {
          state.isBusy = false;
          state.status =
            status +
            seri +
            ', độ chính xác: ' +
            value.coords.accuracy.toFixed(0) +
            ' mét';
          return {...state};
        });

        //console.log('save cordinate:', ok);
      },
      err => {
        console.log('err:', err);
        showAlert(err.message);
      },
      {
        enableHighAccuracy: true,
      },
    );
  } catch (err) {
    setStatus(err.message);
    hookProps.setState(state => {
      state.isBusy = false;
      state.status = 'Lỗi: ' + err.message;
      return {...state};
    });
  } finally {
  }
}
