import React, {Dispatch, useState} from 'react';
import {PropsAppSetting, getDefaultStorageValue} from '../service/storage';
import {PropsInfoUser, PropsInfoWM, PropsLineServer} from '../service/user';
import {Buffer} from 'buffer';
import {Platform} from 'react-native';

export type PropsStoreMeter = {
  listLine: PropsLineServer[];
  data: PropsInfoWM[];
};

export type PropsKeyAesStore = {
  keyOptical: Buffer;
  keyRadio: Buffer;
};

export function getDefaultKeyAesStore(): PropsKeyAesStore {
  const dataKeyOptical = Buffer.from([
    0x2e, 0x7e, 0x15, 0x12, 0x20, 0x04, 0xd4, 0xa6, 0xab, 0xf7, 0x14, 0x88,
    0x09, 0xca, 0x4d, 0x3c,
  ]);
  const dataKeyRadio = Buffer.from([
    0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6, 0xab, 0xf7, 0x15, 0x88,
    0x09, 0xcf, 0x4f, 0x3c,
  ]);
  return {
    keyOptical: dataKeyOptical,
    keyRadio: dataKeyRadio,
  };
}

export type TYPE_TOUCH_ID = 'FaceID' | 'TouchID' | 'NoSupport';

type PropsState = {
  hhu: {
    //isConnected: boolean;
    connect: 'DISCONNECTED' | 'CONNECTED' | 'CONNECTING';
    idConnected: string | null;
    version: string;
    shortVersion: string;
  };
  net: {
    netConnected: boolean;
    netReachAble: boolean;
  };
  app: {
    mdVersion: boolean;
    enableDebug: boolean;
  };

  config: {
    IP: string;
    port: string;
    txPower: string;
  };
  alert: {
    show: boolean;
  };
  appSetting: PropsAppSetting;
  modal: {
    showInfo: boolean;
    showWriteRegister: boolean;
    modalAlert: {
      title: string;
      content: string;
      onOKPress: () => void;
      onDissmiss?: () => void;
    };
  };
  userInfo: PropsInfoUser;
  meter: PropsStoreMeter;
  keyAes: PropsKeyAesStore;
  typeTouchID: TYPE_TOUCH_ID;
  isBusy: boolean;
  canShowModalBusy: boolean;
};

export type PropsStore = {
  state: PropsState;
  setState: Dispatch<React.SetStateAction<PropsState>>;
};

export const storeContext = React.createContext<PropsStore>(null);

export const StoreProvider = ({children}) => {
  const userInfo = {} as PropsInfoUser;
  const [state, setState] = useState<PropsState>({
    hhu: {
      //isConnected: false,
      connect: 'DISCONNECTED',
      idConnected: null,
      version: '',
      shortVersion: '',
    },

    net: {
      netReachAble: false,
      netConnected: false,
    },
    app: {
      enableDebug: false,
      mdVersion: false,
    },
    config: {
      IP: '',
      port: '',
      txPower: '',
    },
    alert: {
      show: false,
    },
    appSetting: getDefaultStorageValue(),
    modal: {
      showInfo: false,
      showWriteRegister: false,
      modalAlert: {
        title: 'no content',
        content: 'no content',
        onOKPress: () => {},
      },
    },
    userInfo: userInfo,
    meter: {
      listLine: [],
      data: [],
    },
    keyAes: getDefaultKeyAesStore(),
    typeTouchID: Platform.OS === 'ios' ? 'FaceID' : 'TouchID',
    isBusy: true,
    canShowModalBusy: false,
  });

  const initialValue: PropsStore = {
    state,
    setState,
  };

  return (
    <storeContext.Provider value={initialValue}>
      {children}
    </storeContext.Provider>
  );
};
