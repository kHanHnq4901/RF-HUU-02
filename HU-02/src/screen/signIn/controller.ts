import React from 'react';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {getUserStorage} from '../../service/storage/user';
import {PropsStore, storeContext} from '../../store';
import {StackRootList} from '../../navigation/model/model';
import {updateValueAppSettingFromNvm} from '../../service/storage';
import {onFingerPress} from './handle';

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
let firstTime = true;
export async function onInit() {
  navigation.addListener('focus', async () => {
    hook.setState(state => {
      state.password = '';
      return {...state};
    });

    const appSetting = await updateValueAppSettingFromNvm();

    const user = await getUserStorage();

    store.setState(state => {
      state.appSetting = appSetting;
      state.userInfo.USER_ACCOUNT = user.userAccount;
      state.userInfo.USER_TEL = user.userAccount;
      return {...state};
    });
  });

  navigation.addListener('beforeRemove', e => {
    //console.log('e:', e);
    e.preventDefault();
  });

  if(firstTime)
  {
    onFingerPress(false);
    firstTime = false;
  }
  
}

export function onDeInit() {}
