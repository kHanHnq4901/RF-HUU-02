import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {StackRootList} from '../../navigation/model';
import {PropsStore, storeContext} from '../../store';

type PropsSignup = {
  userAccount: string;
  password: string;
  rePassword: string;
  userName: string;
  address: string;
  email: string;
  tel: string;
};

type PropsState = {
  signupInfo: PropsSignup;
  btnSignupBusy: boolean;
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
    signupInfo: {
      userAccount: '',
      password: '',
      rePassword: '',
      userName: '',
      address: '',
      email: '',
      tel: '',
    },
    btnSignupBusy: false,
  });

  hook.state = state;
  hook.setState = setState;

  store = React.useContext(storeContext);

  navigation = useNavigation<StackNavigationProp<StackRootList>>();
}

export async function onInit() {
  navigation.addListener('focus', () => {
    hook.setState(state => {
      state.signupInfo.password = '';
      state.signupInfo.rePassword = '';
      return {...state};
    });
  });
}

export function onDeInit() {}
