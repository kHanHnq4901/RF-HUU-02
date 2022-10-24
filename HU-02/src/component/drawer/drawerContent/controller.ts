import {useContext} from 'react';
import {bleManagerEmitter} from '../../../screen/ble/controller';
import {onReceiveSharingIntent} from '../../../service/event';
import {requestPermissionWriteExternalStorage} from '../../../service/permission';
import {
  PATH_IMPORT_CSDL,
  PATH_EXECUTE_CSDL,
  PATH_EXPORT_CSDL,
  PATH_IMPORT_XML,
  PATH_EXPORT_XML,
  PATH_EXPORT_XML_EXTERNAL,
} from '../../../shared/path';
import {PropsStore, storeContext} from '../../../store';
import RNFS from 'react-native-fs';
import {updateValueAppSettingFromNvm} from '../../../service/storage';
import {Alert, DeviceEventEmitter, EmitterSubscription} from 'react-native';
import {UPDATE_FW_HHU} from '../../../service/event/constant';
import {checkTabelDBIfExist} from '../../../database/repository';
import {ObjSend} from '../../../service/hhu/Ble/hhuFunc';
import {
  connectLatestBLE,
  handleUpdateValueForCharacteristic,
} from '../../../service/hhu/Ble/bleHhuFunc';
import {getLineList, getMeterByAccount} from '../../../service/user';
import {showAlert} from '../../../util';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackRootList} from '../../../navigation/model/model';

const TAG = 'controllerDrawerContent:';

export let store = {} as PropsStore;

let navigationStackRoot = {} as StackNavigationProp<StackRootList>;

let hhuDisconnectListener: any = null;
let hhuReceiveDataListener: any = null;

let updateFWListener: EmitterSubscription | undefined;

export const GetHookProps = () => {
  store = useContext(storeContext);
  navigationStackRoot = useNavigation<StackNavigationProp<StackRootList>>();
};

const hhuHandleDisconnectedPeripheral = data => {
  console.log('data disconnect peripheral:', data);
  store.setState(state => {
    state.hhu.idConnected = null;
    state.hhu.connect = 'DISCONNECTED';
    return {...state};
  });
  ObjSend.id = null;
};

function checkTokenValidInterval() {
  setInterval(() => {
    if (
      new Date().getTime() >=
      (store.state.userInfo.TOKEN_EXPIRED as Date).getTime()
    ) {
      showAlert('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại');
      navigationStackRoot.push('SignIn');
    }
  }, 10000);
}

export const onInit = async navigation => {
  let appSetting = await updateValueAppSettingFromNvm();
  store.setState(state => {
    state.appSetting = appSetting;
    return {...state};
  });

  console.log('add listener drawer');
  if (!hhuDisconnectListener) {
    hhuDisconnectListener = bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      hhuHandleDisconnectedPeripheral,
    );
  }
  if (!hhuReceiveDataListener) {
    hhuReceiveDataListener = bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic,
    );
  }

  try {
    if (store.state.hhu.connect === 'DISCONNECTED') {
      connectLatestBLE(store);
    }
  } catch (err) {
    store.setState(state => {
      state.hhu.connect = 'DISCONNECTED';
      return {...state};
    });
  }
  if (store.state.user === 'customer') {
    try {
      //await getMeterByAccount();

      await getLineList();

      checkTokenValidInterval();
    } catch (err) {
      console.log(TAG, err.message);
    }
  }

  try {
    let result = await requestPermissionWriteExternalStorage();

    if (result === true) {
      try {
        let folderExist = await RNFS.exists(PATH_IMPORT_CSDL);
        if (folderExist !== true) {
          console.log('create folder for list csdl');
          await RNFS.mkdir(PATH_IMPORT_CSDL);
        }
        folderExist = await RNFS.exists(PATH_EXECUTE_CSDL);
        if (folderExist !== true) {
          console.log('create folder for excecute csdl');
          await RNFS.mkdir(PATH_EXECUTE_CSDL);
        }
        folderExist = await RNFS.exists(PATH_EXPORT_CSDL);
        if (folderExist !== true) {
          console.log('create folder for export csdl');
          await RNFS.mkdir(PATH_EXPORT_CSDL);
        }

        folderExist = await RNFS.exists(PATH_IMPORT_XML);
        if (folderExist !== true) {
          await RNFS.mkdir(PATH_IMPORT_XML);
        }
        folderExist = await RNFS.exists(PATH_EXPORT_XML);
        if (folderExist !== true) {
          await RNFS.mkdir(PATH_EXPORT_XML);
        }
        folderExist = await RNFS.exists(PATH_EXPORT_XML_EXTERNAL);
        if (folderExist !== true) {
          await RNFS.mkdir(PATH_EXPORT_XML_EXTERNAL);
        }
        // folderExist = await RNFS.exists(PATH_EXPORT_CSDL);
        // if (folderExist !== true) {
        //   console.log('create folder for export csdl');
        //   await RNFS.mkdir(PATH_EXPORT_CSDL);
        // }
      } catch (err) {
        console.log(TAG, err.message);
      }

      onReceiveSharingIntent();

      await checkTabelDBIfExist();
    }

    //exportXmlController.createDirectory();
  } catch (err) {
    console.log(TAG, err);
  }

  updateFWListener = DeviceEventEmitter.addListener(UPDATE_FW_HHU, () => {
    Alert.alert('Cập nhật HHU', 'Cập nhật phần mềm cho thiết bị cầm tay', [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('BoardBLE', {
            title: 'Thiết bị cầm tay',
            info: 'Cập nhật phần mềm cho thiết bị cầm tay',
            isUpdate: true,
          });
        },
        style: 'default',
      },
    ]);
  });
};

export const onDeInit = async () => {
  console.log('remove listener ble');
  if (hhuDisconnectListener) {
    hhuDisconnectListener.remove();
  }
  if (hhuReceiveDataListener) {
    hhuReceiveDataListener.remove();
  }
  if (updateFWListener) {
    updateFWListener.remove();
  }
  updateFWListener = undefined;
  hhuDisconnectListener = null;
  hhuReceiveDataListener = null;
};
