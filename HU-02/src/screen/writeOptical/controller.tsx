import React, {useState} from 'react';
import {PropsStore, storeContext} from '../../store';
import { TextInput } from 'react-native';

export type RadioTextProps = {
  checked: boolean;
  value: string;
};

export type HookState = {
  seriMeter: RadioTextProps;
  seriModule: RadioTextProps;
  immediateData: RadioTextProps;
  isBusy: boolean;
  status: string;
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
  refSeriMeter : React.RefObject<TextInput>;
  refSeriModule : React.RefObject<TextInput>;
  refImmediateData: React.RefObject<TextInput>;
};

const TAG = 'Header Controller: ';

export const hookProps = {} as HookProps;
export let store = {} as PropsStore;

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>({
    seriMeter: {
      checked: false,
      value: '',
    },
    seriModule: {
      checked: false,
      value: '',
    },
    immediateData: {
      checked: false,
      value: '',
    },
    isBusy: false,
    status: '',
  });
  hookProps.state = state;
  hookProps.setState = setState;

  hookProps.refSeriModule = React.createRef<TextInput>();
  hookProps.refSeriMeter = React.createRef<TextInput>();
  hookProps.refImmediateData = React.createRef<TextInput>();

  store = React.useContext(storeContext) as PropsStore;
  return hookProps;
};

export const onInit = async () => {};

export const onDeInit = () => {};
