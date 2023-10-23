import { GeolocationResponse } from '@react-native-community/geolocation';
import axios from 'axios';
import FormData from 'form-data';
import { Platform } from 'react-native';
import { Region } from 'react-native-maps';
import { endPoints, endPointsNsx, getUrl, getUrlNsx } from '../../service/api';
import { emitEventSuccess } from '../../service/event';
import { deleteFile } from '../../shared/file';
import { showAlert, showToast } from '../../util';
import { getGeolocation } from '../declareMeter/handleButton';
import { hookProps, store } from './controller';

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

export function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // If successful -> return with blob
    xhr.onload = function () {
      resolve(xhr.response);
    };

    // reject on error
    xhr.onerror = function () {
      reject(new Error('uriToBlob failed'));
    };

    // Set the response type to 'blob' - this means the server's response
    // will be accessed as a binary object
    xhr.responseType = 'blob';

    // Initialize the request. The third argument set to 'true' denotes
    // that the request is asynchronous
    xhr.open('GET', uri, true);

    // Send the request. The 'null' argument means that no body content is given for the request
    xhr.send(null);
  });
}

function checkCondition(): boolean {
  if (hookProps.state.data.seriMeter.trim().length === 0) {
    showAlert('Chưa điền số seri cơ khí');
    return false;
  }
  if (hookProps.state.data.seriModule.trim().length === 0) {
    showAlert('Chưa điền số seri module');
    return false;
  }
  return true;
}

export async function onSaveLogPress() {
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
    hookProps.setState(state => {
      state.isBusy = true;
      return { ...state };
    });

    let formData = new FormData();

    let sendOk = false;

    let lengthFormData = 0;

    try {
      //const imagesBase64: string[] = [];

      for (let image of hookProps.state.images) {
        if (image.uri) {
          // const base64 = await convertImage2Base64(image.uri);
          // if (base64) {
          //   imagesBase64.push(base64);
          // }

          // blob.
          // formData.append('Images', blob);

          // const blob = await uriToBlob(image.uri);
          // console.log('blob:', JSON.stringify(blob));

          // formData.append('Files', blob);

          const obj = {
            name: image.fileName,
            type: image.type,
            uri:
              Platform.OS === 'ios'
                ? image.uri.replace('file://', '')
                : image.uri,
            // uri: image.uri.replace('file://', ''),
          };
          formData.append('file', obj);
          lengthFormData += image.fileSize ?? 0;
        }
      }

      const params = {
        UserID: store.state.userInfo.USER_ID,
        Token: store.state.userInfo.TOKEN,
        ModuleNo: hookProps.state.data.seriModule,
        MeterNo: hookProps.state.data.seriMeter,

        QCCID: hookProps.state.data.QCCID,
        RSSI: hookProps.state.data.rssi,
        Active: hookProps.state.data.active,
        RegisterModule: hookProps.state.data.registerModule,
        RegisterMeter: hookProps.state.data.registerMeter,
        Note: hookProps.state.data.note,

        Fixed: hookProps.state.data.fixed,

        LatLog:
          hookProps.state.region.latitude +
          ',' +
          hookProps.state.region.longitude,
      };
      let url = getUrlNsx(endPointsNsx.log);

      url = url.replace(store.state.appSetting.hhu.port, '6060');

      for (let item in params) {
        // formData.append(item, params[item]);
        url += `&${item}=${params[item]}`;
      }

      console.log('url:', url);
      console.log('formData:', formData);

      // const formHeaders = formData.getHeaders();

      console.log('lengthFormData:', lengthFormData);

      for (let numRetries = 0; numRetries < 3; numRetries++) {
        const result = await axios({
          method: 'post',
          data: hookProps.state.images.length === 0 ? undefined : formData,
          url: url,
          // timeout: 15000,

          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'Content-Length':
              hookProps.state.images.length === 0 ? undefined : lengthFormData,
          },

          // transformRequest: form => form,
        });

        //console.log('result: ', JSON.stringify(result));

        const response: { CODE: '0' | '1'; MESSAGE: string } = result.data;

        console.log('response:', response);

        if (response.CODE === '1') {
          sendOk = true;
          break;
        } else {
          if (numRetries === 2) {
            showAlert('Lỗi:' + response.MESSAGE ?? '');
          }
        }
      }
    } catch (err) {
      showAlert('Lỗi:' + String(err));
    } finally {
      hookProps.setState(state => {
        state.isBusy = false;
        return { ...state };
      });
      if (sendOk) {
        emitEventSuccess();
        showToast('Log thành công');
        showAlert(
          'Bạn có muốn xoá tất cả ?',
          {
            label: 'Không',
            func: () => {},
          },
          {
            label: 'Xoá',
            func: async () => {
              for (let image of hookProps.state.images) {
                if (image.uri) {
                  await deleteFile(image.uri);
                }
              }
              hookProps.state.images = [];
              const _data = hookProps.state.data;
              for (let itm in _data) {
                _data[itm] = '';
              }
              _data.fixed = false;

              hookProps.setState(state => {
                state.data = _data;
                return { ...state };
              });
            },
          },
        );
      }
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
