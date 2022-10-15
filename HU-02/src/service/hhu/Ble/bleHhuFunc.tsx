import AsyncStorage from '@react-native-community/async-storage';
import {PropsStore} from '../../../store';
import * as Ble from '../../../util/ble';
import BleManager from '../../../util/BleManager';
import {showToast, sleep} from '../../../util';
import {HhuObj, ObjSend, readVersion, ShakeHand} from './hhuFunc';
import {checkUpdateHHU} from '../../api';

const KEY_STORAGE = 'BLE_INFO';
const TAG = 'Ble Func:';

type PropsBleInfo = {
  id: string;
};

export const BleFunc_StartNotification = async (id: string) => {
  console.log('start notification');
  await Ble.startNotification(id);
};

export const BleFunc_StopNotification = async (id: string) => {
  console.log('stop notification');
  await Ble.stopNotification(id);
};

export const BleFunc_Send = async (id: string, data: any[]) => {
  try {
    let dumy: any[] = [];
    dumy.push(0xfe);
    dumy.push(0xfe);
    dumy.push(data.length & 0xff);
    dumy.push((data.length >> 8) & 0xff);
    dumy.push((dumy[2] + dumy[3]) & 0xff);
    //await Ble.send(id, dumy);
    //await Ble.send(id, dumy);

    for (let i = 0; i < data.length; i++) {
      dumy.push(data[i]);
    }

    await Ble.send(id, dumy);

    // console.log(dumy);
    // console.log(data);
  } catch (err) {
    console.log(err);
  }
};

export const BleFunc_SaveStorage = async (id: string) => {
  const item: PropsBleInfo = {
    id: id,
  };
  try {
    AsyncStorage.setItem(KEY_STORAGE, JSON.stringify(item));
  } catch (err) {
    console.log(TAG, String(err));
  }
};

export const BleFunc_TryConnectToLatest = async (): Promise<{
  result: boolean;
  id: string | null;
}> => {
  try {
    const resString = await AsyncStorage.getItem(KEY_STORAGE);
    if (resString) {
      const data = JSON.parse(resString) as PropsBleInfo;
      let result;
      //await BleManager.refreshCache(data.id);
      for (let i = 0; i < 1; i++) {
        result = await Ble.connect(data.id);

        console.log('Connect result: ', result);
        if (result) {
          break;
          // await Ble.startnotification(data.id);
          // const dumy = [0];
          // await Ble.send(data.id, dumy);
          // await Ble.stopNotification(data.id);
        }
        await sleep(500);
      }

      return {result: result, id: data.id};
    } else {
      return {result: false, id: null};
    }
  } catch (err) {
    console.log(TAG, String(err) + new Error().stack);
  }
  return {result: false, id: null};
};

export const connectLatestBLE = async (store: PropsStore) => {
  console.log(TAG, 'try connect to latest');
  showToast('Đang thử kết nối với thiết bị Bluetooth trước đó ...');
  store.setState(state => {
    state.hhu.connect = 'CONNECTING';
    return {...state};
  });
  await BleManager.start({showAlert: false});
  await BleManager.enableBluetooth();
  let data = await BleFunc_TryConnectToLatest();
  //console.log('k');
  if (data.result) {
    store.setState(state => {
      state.hhu.connect = 'CONNECTED';
      state.hhu.idConnected = data.id;
      return {...state};
    });
    ObjSend.id = data.id;
    let result;
    for (let k = 0; k < 2; k++) {
      await sleep(500);
      result = await ShakeHand();
      if (result === true || result === 1) {
        ObjSend.isShakeHanded = true;
        break;
      } else {
        ObjSend.isShakeHanded = false;
      }

      console.log('Try shakehand');
    }
    if (ObjSend.isShakeHanded === false) {
      console.log('ShakeHand failed. Disconnect');
      showToast('ShakeHand failed. Disconnect');
      await BleManager.disconnect(ObjSend.id, true);
    } else {
      showToast('Bắt tay thành công');
      if (result === true) {
        for (let k = 0; k < 2; k++) {
          await sleep(500);
          const version = await readVersion();
          if (version) {
            let arr = version.split('.');
            arr.pop();
            const shortVersion = arr
              .join('.')
              .toLocaleLowerCase()
              .replace('v', '');
            store.setState(state => {
              state.hhu.version = version;
              state.hhu.shortVersion = shortVersion;
              return {...state};
            });
            console.log('Read version succeed');
            checkUpdateHHU();
            break;
          } else {
            console.log('Read version failed');
            console.log('Try read version');
          }
        }
      }
    }
  } else {
    store.setState(state => {
      state.hhu.connect = 'DISCONNECTED';
      return {...state};
    });
    console.log(TAG + 'hhu:', data);
    showToast('Kết nối bluetooth thất bại');
  }
};

export const handleUpdateValueForCharacteristic = data => {
  //console.log('data update for characteristic:', data.value);
  // console.log('Rec ' + Date.now());
  // console.log(ByteArrayToString(data.value, 16, true));
  const receiveData = data.value as number[];

  for (let i = 0; i < receiveData.length; i++) {
    const rxData = receiveData[i] & 0xff;
    // Dbg_Print1("%ld-", rxData);
    if (HhuObj.identityFrame.bActive === false) {
      HhuObj.identityFrame.bActive = true;
      HhuObj.identityFrame.u8CountRecIdentity = 0;
      HhuObj.identityFrame.bIdentityFinish = false;
    }
    if (HhuObj.identityFrame.bIdentityFinish === false) {
      HhuObj.identityFrame.au8IdentityBuff[
        HhuObj.identityFrame.u8CountRecIdentity
      ] = rxData;
      HhuObj.identityFrame.u8CountRecIdentity++;
      if (
        HhuObj.identityFrame.u8CountRecIdentity ===
        HhuObj.identityFrame.au8IdentityBuff.length
      ) {
        if (
          HhuObj.identityFrame.au8IdentityBuff[0] === 0xfe &&
          HhuObj.identityFrame.au8IdentityBuff[1] === 0xfe
        ) {
          if (
            ((HhuObj.identityFrame.au8IdentityBuff[2] +
              HhuObj.identityFrame.au8IdentityBuff[3]) &
              0xff) !==
            (HhuObj.identityFrame.au8IdentityBuff[4] & 0xff)
          ) {
            HhuObj.identityFrame.bActive = false;
          } else {
            HhuObj.identityFrame.bIdentityFinish = true;
            HhuObj.identityFrame.u16Length =
              (HhuObj.identityFrame.au8IdentityBuff[2] & 0xff) |
              ((HhuObj.identityFrame.au8IdentityBuff[3] & 0xff) << 8);
            HhuObj.countRec = 0;
          }
        } else {
          HhuObj.identityFrame.bActive = false;
        }
      }
    } else if (HhuObj.identityFrame.bIdentityFinish === true) {
      HhuObj.buffRx[HhuObj.countRec] = rxData;

      HhuObj.countRec = (HhuObj.countRec + 1) % HhuObj.buffRx.byteLength;
      if (HhuObj.countRec === HhuObj.identityFrame.u16Length) {
        //const arrb = [];
        console.log('Rec a frame: ' + HhuObj.countRec + ' bytes:');
        // for (let k = 0; k < HhuObj.countRec; k++) {
        //   arrb.push(HhuObj.buffRx[k]);
        // }
        // console.log(arrb);
        HhuObj.flag_rec = true;
        HhuObj.identityFrame.bActive = false;
      }
    }
  }
};
