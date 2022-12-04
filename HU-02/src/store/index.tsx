import React, {Dispatch, useState} from 'react';
import {getDefaultStorageValue, PropsAppSetting} from '../service/storage';
import {
  PropsInfoUser,
  PropsInfoWM,
  PropsLineServer,
  USER_ROLE_TYPE,
} from '../service/user';

export type PropsStoreMeter = {
  listLine: PropsLineServer[];
  data: PropsInfoWM[];
};

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
  };
  userInfo: PropsInfoUser;
  meter: PropsStoreMeter;
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
    },
    userInfo: userInfo,
    meter: {
      listLine: [],
      data: [],
    },
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
