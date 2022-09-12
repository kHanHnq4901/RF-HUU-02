import React, { Dispatch, SetStateAction, useState } from 'react';
import { PropsKHCMISModel } from '../database/model';
import { getDefaultStorageValue, PropsAppSetting } from '../service/storage';

type PropsState = {
  hhu: {
    //isConnected: boolean;
    connect: 'DISCONNECTED' | 'CONNECTED' | 'CONNECTING';
    idConnected: string | null;
    version: string;
    shortVersion: string;
  };
  net: {
    netconnected: boolean;
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
};

type PropsDataDB = {
  item: PropsKHCMISModel;
  id: string;
};

type PropsData = {
  dataBD: PropsDataDB[];
  codeStation: string[];
  codeBook: string[];
  codeColumn: string[];
};

export type PropsStore = {
  data: PropsData[];
  setData: Dispatch<SetStateAction<PropsData[]>>;
  value: PropsState;
  setValue: Dispatch<React.SetStateAction<PropsState>>;
};

export const storeContext = React.createContext<PropsStore | null>(null);

export const StoreProvider = ({ children }) => {
  const [data, setData] = useState<PropsData[]>([]);

  const [hook, setHook] = useState<PropsState>({
    hhu: {
      //isConnected: false,
      connect: 'DISCONNECTED',
      idConnected: null,
      version: '',
      shortVersion: '',
    },

    net: {
      netReachAble: false,
      netconnected: false,
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
  });

  const initialalue: PropsStore = {
    data: data,
    setData: setData,
    value: hook,
    setValue: setHook,
  };

  return (
    <storeContext.Provider value={initialalue}>
      {children}
    </storeContext.Provider>
  );
};
