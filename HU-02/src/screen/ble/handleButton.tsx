import BleManager from '../../util/BleManager';
import {sleep} from '../../util';
import {
  hookProps,
  requestGps,
  setStatus,
  store,
} from './controller';
import * as Ble from '../../util/ble';
import {BleFunc_SaveStorage} from '../../service/hhu/Ble/bleHhuFunc';
import {ObjSend, readVersion, ShakeHand} from '../../service/hhu/Ble/hhuFunc';
import {checkUpdateHHU} from '../../service/api';
import { requestPermissionScan } from '../../service/permission';

const TAG = 'handleBtn Ble:';

export const connectHandle = async (id: string) => {
  try {
    if (store.state.hhu.connect === 'CONNECTED') {
      await BleManager.disconnect(store.state.hhu.idConnected, true);
    }
    let succeed: boolean = false;
    try {
      store.setState(state => {
        state.hhu.connect = 'CONNECTING';
        return {...state};
      });
      //await BleManager.refreshCache(id);
      succeed = await Ble.connect(id);
    } catch (err) {
      store.setState(state => {
        state.hhu.connect = 'DISCONNECTED';
        return {...state};
      });
      setStatus('Kết nối thất bại: ' + err.message);
    }

    if (succeed) {
      setStatus('Kết nối thành công');
      store.setState(state => {
        state.hhu.idConnected = id;
        state.hhu.connect = 'CONNECTED';
        return {...state};
      });
      //Ble.startnotification(id);
      BleFunc_SaveStorage(id);
      ObjSend.id = id;
      await sleep(500);
      const result = await ShakeHand();
      if (result === true) {
        setStatus('Bắt tay thành công');
        ObjSend.isShakeHanded = true;
        for (let k = 0; k < 2; k++) {
          await sleep(500);
          const version = await readVersion();
          if (version) {
            let arr = version.split('.');
            arr.length = 2;
            const shortVersion = arr
              .join('.')
              .toLocaleLowerCase()
              .replace('v', '');
            store.setState(state => {
              state.hhu.version = version;
              state.hhu.shortVersion = shortVersion;
              return {...state};
            });
            console.log('Read version succeed:' + version);
            console.log('Short version:' + shortVersion);
            checkUpdateHHU();
            break;
          } else {
            console.log('Read version failed');
            console.log('Try read version');
          }
        }
      } else if (result === 1) {
        setStatus('Cần nạp firmware HU');
      } else {
        setStatus('Bắt tay thất bại');
        ObjSend.isShakeHanded = false;
        BleManager.disconnect(ObjSend.id, true);
      }
    } else {
      setStatus('Kết nối thất bại');
    }
    //navigation.goBack();
  } catch (err) {
    console.log(TAG, err);
    setStatus('Kết nối thất bại: ' + err.message);
  }
};

export const onScanPress = async () => {
  if (hookProps.state.ble.isScan === true) {
    return;
  }
  hookProps.setState(state => {
    state.ble.listNewDevice = [];
    state.status = '';
    return {...state};
  });
  let requestScanPermission = await requestPermissionScan();
  let requestPermissionGps = await requestGps();
  if (requestScanPermission === true && requestPermissionGps) {
    await BleManager.enableBluetooth();
    await BleManager.start();
    BleManager.scan([], 5, false)
      .then(() => {
        hookProps.setState(state => {
          state.ble.isScan = true;
          return {...state};
        });
      })
      .catch(resFail => {
        console.log('fail: ', resFail);
      });
  } else {
    console.log('requestGps failed');
  }
};

export const disConnect = async (id: string) => {
  try {
    //console.log('here:', store.state.bleConnected);
    if (store.state.hhu.connect === 'CONNECTED') {
      console.log('diconnect...');
      //await Ble.stopNotification(id);
      if (id === null) {
      } else {
        await BleManager.disconnect(id, true);
      }
    }
  } catch {}
};
