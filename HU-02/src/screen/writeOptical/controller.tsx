import React, {useState} from 'react';
import {PropsStore, storeContext} from '../../store';
import {TextInput} from 'react-native';

export type RadioTextProps = {
  checked: boolean;
  // value: string;
};

type DataType = {
  seriMeter: string;
  seriModule: string;
  immediateData: string;
  ipPortString: string;
};

export type HookState = {
  seriMeter: RadioTextProps;
  seriModule: RadioTextProps;
  immediateData: RadioTextProps;
  ipPort: RadioTextProps;
  isBusy: boolean;
  status: string;
};

export type HookProps = {
  state: HookState;
  setState: React.Dispatch<React.SetStateAction<HookState>>;
  refSeriMeter: React.RefObject<TextInput>;
  refSeriModule: React.RefObject<TextInput>;
  refImmediateData: React.RefObject<TextInput>;
  refIPPort: React.RefObject<TextInput>;
  data: DataType;
};

const TAG = 'Header Controller: ';

export const hookProps = {} as HookProps;
export let store = {} as PropsStore;

hookProps.data = {
  seriMeter: '',
  seriModule: '',
  immediateData: '',
  ipPortString:'',
};

export const GetHookProps = (): HookProps => {
  const [state, setState] = useState<HookState>({
    seriMeter: {
      checked: false,
      // value: '',
    },
    seriModule: {
      checked: false,
      // value: '',
    },
    immediateData: {
      checked: false,
      // value: '',
    },
    ipPort: {
      checked: false,
    },
    isBusy: false,
    status: '',
  });
  hookProps.state = state;
  hookProps.setState = setState;

  hookProps.refSeriModule = React.createRef<TextInput>();
  hookProps.refSeriMeter = React.createRef<TextInput>();
  hookProps.refImmediateData = React.createRef<TextInput>();
  hookProps.refIPPort = React.createRef<TextInput>();

  store = React.useContext(storeContext) as PropsStore;
  return hookProps;
};

export const onInit = async () => {};

export const onDeInit = () => {};
