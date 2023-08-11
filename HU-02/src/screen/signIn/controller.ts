import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { getUserStorage } from '../../service/storage/user';
import { PropsStore, TYPE_TOUCH_ID, storeContext } from '../../store';
import { StackRootList } from '../../navigation/model/model';
import { updateValueAppSettingFromNvm } from '../../service/storage';
import { onFingerPress } from './handle';
import TouchID from 'react-native-touch-id';
import { showToast } from '../../util';

type PropsState = {
  password: string;
  btnSignInBusy: boolean;
};

type PropsHook = {
  state: PropsState;
  setState: React.Dispatch<React.SetStateAction<PropsState>>;
};

export const hook = {} as PropsHook;
export let store = {} as PropsStore;
export let navigation = {} as StackNavigationProp<StackRootList>;

export function UpdateHook() {
  const [state, setState] = React.useState<PropsState>({
    password: '',
    btnSignInBusy: false,
  });

  hook.state = state;
  hook.setState = setState;

  store = React.useContext(storeContext);

  navigation = useNavigation<StackNavigationProp<StackRootList>>();
}

export const olState = {
  userName: '',
};

let firstTime = true;
export async function onInit() {
  navigation.addListener('focus', async () => {
    hook.setState(state => {
      state.password = '';
      return { ...state };
    });

    const appSetting = await updateValueAppSettingFromNvm();

    const user = await getUserStorage();

    olState.userName = user.userAccount;

    let typeTouchID: TYPE_TOUCH_ID = 'TouchID';
    try {
      let isSupport = await TouchID.isSupported();
      if (isSupport === 'FaceID') {
        typeTouchID = 'FaceID';
      } else if (isSupport === 'TouchID') {
        typeTouchID = 'TouchID';
      }
    } catch (e) {
      typeTouchID = 'NoSupport';
    } finally {
    }

    store.setState(state => {
      state.appSetting = appSetting;
      state.userInfo.USER_ACCOUNT = user.userAccount;
      state.userInfo.USER_TEL = user.userAccount;
      state.typeTouchID = typeTouchID;
      return { ...state };
    });

    if (
      appSetting.server.host.trim().length === 0 ||
      appSetting.server.port.trim().length === 0
    ) {
      showToast('Cấu hình địa chỉ IP');
      navigation.navigate('Setting');
      return;
    } else {
      if (firstTime && typeTouchID === 'TouchID') {
        firstTime = false;
        console.log('here');
        onFingerPress(false);
      }
    }
  });

  navigation.addListener('beforeRemove', e => {
    //console.log('e:', e);
    e.preventDefault();
  });
}

export function onDeInit() {}
