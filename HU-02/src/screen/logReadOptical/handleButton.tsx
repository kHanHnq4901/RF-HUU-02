import { GeolocationResponse } from '@react-native-community/geolocation';
import { Region } from 'react-native-maps';
import { showAlert, showToast } from '../../util';
import { getGeolocation } from '../declareMeter/handleButton';
import { hookProps, store } from './controller';
import { endPointsNsx, getUrlNsx } from '../../service/api';
import axios from 'axios';
import { convertImage2Base64, deleteFile } from '../../shared/file';
import { emitEventSuccess } from '../../service/event';

export function onRegionChangeComplete(region: Region) {
  console.log('region:', region);
  hookProps.setState(state => {
    state.region = { ...region };
    return { ...state };
  });
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
          const region = { ...state.region };

          region.latitude = location.coords.latitude;
          region.longitude = location.coords.longitude;

          console.log('region:', region);

          state.region = region;
          return { ...state };
        });
        showToast('Đã cập nhật toạ độ hiện tại');
        return;
      }

      break;
    }
  }
  if (location === null) {
    showAlert('Không thể lấy vị trí hiện tại. Thử lại sau ');
  }
}

export async function onSaveLogPress() {
  if (hookProps.state.isBusy) {
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
    hookProps.setState(state => {
      state.isBusy = true;
      return { ...state };
    });

    try {
      const imagesBase64: string[] = [];

      for (let image of hookProps.state.images) {
        if (image.uri) {
          const base64 = await convertImage2Base64(image.uri);
          if (base64) {
            imagesBase64.push(base64);
          }
        }
      }

      const url = getUrlNsx(endPointsNsx.log);
      const result = await axios.get(url, {
        params: {
          UserAccount: store.state.userInfo.USER_ACCOUNT,
          Token: store.state.userInfo.TOKEN,
          SeriModule: hookProps.state.data.seriModule,
          SeriMeter: hookProps.state.data.seriMeter,

          QCCID: hookProps.state.data.QCCID,
          Rssi: hookProps.state.data.rssi,
          Active: hookProps.state.data.active,
          RegisterModule: hookProps.state.data.registerModule,
          RegisterMeter: hookProps.state.data.registerMeter,
          Note: hookProps.state.data.note,

          Fixed: hookProps.state.data.fixed,

          LatLog:
            hookProps.state.region.latitude +
            ',' +
            hookProps.state.region.longitude,
          Images: imagesBase64,
        },
      });
      //console.log('result: ', JSON.stringify(result));

      const response: { CODE: '0' | '1'; MESSAGE: string } = result.data;

      console.log('response:', response);

      if (response.CODE === '1') {
        for (let image of hookProps.state.images) {
          if (image.uri) {
            await deleteFile(image.uri);
          }
        }
        hookProps.state.images = [];
      } else {
        showAlert('Lỗi:' + response.MESSAGE ?? '');
      }
    } catch (err) {
      showAlert('Lỗi:' + String(err));
    } finally {
      hookProps.setState(state => {
        state.isBusy = false;
        return { ...state };
      });
    }
  }
}

export function calculateDelta() {
  try {
    if (
      hookProps.state.data.registerMeter.trim().length > 0 &&
      hookProps.state.data.registerModule.length > 0
    ) {
      const registerModule = Number(hookProps.state.data.registerModule);
      const registerMeter = Number(hookProps.state.data.registerMeter);
      const delta = registerModule - registerMeter;
      hookProps.setState(state => {
        state.data.deltaRegister = delta.toString();
        return { ...state };
      });
    }
  } catch {}
}
