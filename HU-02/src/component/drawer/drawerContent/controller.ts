import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useContext } from 'react';
import {
  Alert,
  AppState,
  DeviceEventEmitter,
  EmitterSubscription,
  NativeEventSubscription,
  Platform,
} from 'react-native';
import RNFS from 'react-native-fs';
import { checkTabelDBIfExist } from '../../../database/repository';
import { checkTabelDeclareMeterIfExist } from '../../../database/repository/declareMeterRepository';
import {
  ClearAllSentDataMeterForGarbage,
  SendDataUnsentMeterProcess,
} from '../../../database/service/dataMeterService';
import {
  ClearAllDeclareMeterForGarbage,
  SendUnsentDeclareMeterProcess,
} from '../../../database/service/declareMeterService';
import {
  DrawerNavigationProps,
  DrawerParamsList,
  StackRootList,
} from '../../../navigation/model/model';
import { bleManagerEmitter } from '../../../screen/ble/controller';
import {
  ListenEventSucceedError,
  emitEventSuccess,
} from '../../../service/event';
import { UPDATE_FW_HHU } from '../../../service/event/constant';
import {
  connectLatestBLE,
  handleUpdateValueForCharacteristic,
  initModuleBle,
} from '../../../service/hhu/Ble/bleHhuFunc';
import { ObjSend } from '../../../service/hhu/Ble/hhuFunc';
import {
  requestPermissionBleConnectAndroid,
  requestPermissionWriteExternalStorage,
} from '../../../service/permission';
import {
  convertKeyStorageToKeyStore,
  updateValueAppSettingFromNvm,
} from '../../../service/storage';
import { USER_ROLE_TYPE } from '../../../service/user';
import {
  PATH_EXECUTE_CSDL,
  PATH_EXPORT_LOG,
  PATH_EXPORT_XML,
  PATH_IMPORT_CSDL,
  PATH_IMPORT_XML,
} from '../../../shared/path';
import { PropsStore, storeContext } from '../../../store';
import { showAlert, showAlertProps } from '../../../util';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const TAG = 'controllerDrawerContent:';

export let store = {} as PropsStore;

export let navigationStackRoot = {} as StackNavigationProp<StackRootList>;
export let navigationDrawer = {} as DrawerNavigationProp<DrawerParamsList>;

let hhuDisconnectListener: any = null;
let hhuReceiveDataListener: any = null;

let updateFWListener: EmitterSubscription | undefined;

let timerCheckValidToken: any;

let unsubscribeNet;

export const GetHookProps = () => {
  store = useContext(storeContext);
  navigationStackRoot = useNavigation<StackNavigationProp<StackRootList>>();
  navigationDrawer = useNavigation<DrawerNavigationProps>();
};

const hhuHandleDisconnectedPeripheral = data => {
  console.log('data disconnect peripheral:', data);
  store.setState(state => {
    state.hhu.idConnected = null;
    state.hhu.connect = 'DISCONNECTED';
    return { ...state };
  });
  ObjSend.id = null;
};

function checkTokenValidInterval() {
  console.log('add event check token');

  timerCheckValidToken = setInterval(() => {
    if (
      new Date().getTime() >=
      (store.state.userInfo.TOKEN_EXPIRED as Date).getTime()
    ) {
      showAlert('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại');
      navigationStackRoot.push('SignIn');
    }
  }, 5 * 60000);
}

let isShowAlertInvalidToken = false;
export async function checkIsInvalidToken(errIsInvalidToken: string) {
  if (isShowAlertInvalidToken === true) {
    return;
  }

  isShowAlertInvalidToken = true;
  console.log('errIsInvalidToken:', errIsInvalidToken);

  if (errIsInvalidToken && errIsInvalidToken === 'invalid token') {
    showAlertProps({
      message:
        'Tài khoản đang được đăng nhập bởi 1 thiết bị khác hoặc đã hết phiên làm việc',
      one: {
        label: 'Đăng nhập lại',
        func: () => {
          navigationStackRoot.push('SignIn');
          isShowAlertInvalidToken = false;
        },
      },
    });
  }
}

let subscriptionAppState: NativeEventSubscription | null = null;

export const onInit = async navigation => {
  let appSetting = await updateValueAppSettingFromNvm();
  // console.log('appSetting:', appSetting);
  // console.log('appSetting.keyAes:', appSetting.keyAes);

  const keyAesStore = convertKeyStorageToKeyStore(appSetting.keyAes);

  // console.log(
  //   'Key optical:',
  //   ByteArrayToString(keyAesStore.keyOptical, 0, 16, 16, true),
  // );
  // console.log(
  //   'Key radio:',
  //   ByteArrayToString(keyAesStore.keyRadio, 0, 16, 16, true),
  // );

  store.setState(state => {
    state.appSetting = appSetting;
    state.keyAes = keyAesStore;
    return { ...state };
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

  await initModuleBle();

  try {
    if (store.state.hhu.connect === 'DISCONNECTED') {
      let requestScan = true;
      if (Platform.OS === 'android') {
        requestScan = await requestPermissionBleConnectAndroid();
      }
      if (requestScan) {
        connectLatestBLE(store);
      }
    }
  } catch (err) {
    store.setState(state => {
      state.hhu.connect = 'DISCONNECTED';
      return { ...state };
    });
  }

  // console.log(
  //   'store.state.userInfo.USER_TYPE:',
  //   store.state.userInfo.USER_TYPE,
  // );

  if (
    store.state.userInfo.USER_TYPE === USER_ROLE_TYPE.CUSTOMER ||
    store.state.userInfo.USER_TYPE === USER_ROLE_TYPE.STAFF
  ) {
    subscriptionAppState = AppState.addEventListener('change', nextState => {
      console.log('nextState:', nextState);

      if (nextState === 'active') {
        checkTokenValidInterval();
      } else if (nextState === 'background') {
        if (timerCheckValidToken) {
          console.log('clear event check token');
          clearInterval(timerCheckValidToken);
        }
      }
    });
  }

  try {
    let result = await requestPermissionWriteExternalStorage();

    //console.log(TAG, 'result request:', result);

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

        folderExist = await RNFS.exists(PATH_IMPORT_XML);
        if (folderExist !== true) {
          await RNFS.mkdir(PATH_IMPORT_XML);
        }
        folderExist = await RNFS.exists(PATH_EXPORT_XML);
        if (folderExist !== true) {
          await RNFS.mkdir(PATH_EXPORT_XML);
        }
        //console.log('create folder external');

        folderExist = await RNFS.exists(PATH_EXPORT_LOG);
        if (folderExist !== true) {
          await RNFS.mkdir(PATH_EXPORT_LOG);
        }
      } catch (err) {
        console.log(TAG, err.message);
      }

      //onReceiveSharingIntent();

      await checkTabelDBIfExist();
      await checkTabelDeclareMeterIfExist();

      unsubscribeNet = NetInfo.addEventListener(async state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        if (state.isConnected) {
          await SendUnsentDeclareMeterProcess();

          await SendDataUnsentMeterProcess();
        }
      });

      await ClearAllDeclareMeterForGarbage();
      await ClearAllSentDataMeterForGarbage();
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
  ListenEventSucceedError();

  // emitEventSuccess();
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
  if (timerCheckValidToken) {
    clearInterval(timerCheckValidToken);
  }
  if (unsubscribeNet) {
    unsubscribeNet();
  }

  subscriptionAppState?.remove();
};
