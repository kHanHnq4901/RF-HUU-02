import {store} from '../../component/drawer/drawerContent/controller';
import {PropsStoreMeter} from '../../store';
import axios from 'axios';
import {GetFormatDate} from './util';
import NetInfo from '@react-native-community/netinfo';

const TAG = 'USER Service:';

export type PropsResponse = {
  succeed: boolean;
  message: string;
  data: any;
};

export type PropsInfoUser = {
  CODE: string;
  MESSAGE: string;
  USER_ID: string;
  USER_ACCOUNT: string;
  USER_NAME: string;
  USER_ADDRESS: string;
  USER_TEL: string;
  USER_EMAIL: string;
  LASTACTIVE_TIME: string;
  TOKEN: string;
  TOKEN_EXPIRED: string | Date;
};
export type PropsInfoWM = {
  ADDRESS: string;
  CREATED: string;
  CUSTOMER_CODE: string;
  CUSTOMER_NAME: string;
  EMAIL: string;
  LINE_NAME: string;
  METER_MODEL_DESC: string;
  METER_NAME: string;
  METER_NO: string;
  MODULE_NO: string;
  PHONE: string;
};

export type PropsLineServer = {
  ADDRESS: string;
  CODE: string;
  LINE_ID: string;
  LINE_NAME: string;
};

export async function getMeterByAccount(): Promise<PropsResponse> {
  const ret = {} as PropsResponse;

  ret.succeed = false;
  ret.message = '';

  try {
    //GetMeterAccount(string UserAccount, string Token)
    const url =
      'http://' +
      store.state.appSetting.server.host +
      ':' +
      store.state.appSetting.server.port +
      '/api' +
      '/GetMeterAccount';
    const {data}: {data: {CODE: string; MESSAGE: string}} = await axios.get(
      url,
      {
        params: {
          UserAccount: store.state.userInfo.USER_ACCOUNT,
          Token: store.state.userInfo.TOKEN,
        },
      },
    );

    if (data.CODE === '0') {
      console.log(TAG, 'Lỗi:', data.MESSAGE);
    } else {
    }

    const setLine = new Set<string>();

    const listWM = data as unknown as PropsInfoWM[];

    for (let wm of listWM) {
      setLine.add(wm.LINE_NAME);
    }

    const listLine: string[] = Array.from(setLine);

    const dat = {} as PropsStoreMeter;

    dat.data = listWM;
    dat.listLine = listLine;

    ret.data = dat;
    ret.succeed = true;

    store.setState(state => {
      state.meter = dat;
      return {...state};
    });

    //console.log('dat:', dat);
  } catch (err: any) {
    console.log(TAG, 'Lỗi:', err.message);
  }

  return ret;
}

export async function getLineList(): Promise<PropsResponse> {
  const ret = {} as PropsResponse;

  ret.succeed = false;
  ret.message = '';

  try {
    //GetMeterAccount(string UserAccount, string Token)
    const url =
      'http://' +
      store.state.appSetting.server.host +
      ':' +
      store.state.appSetting.server.port +
      '/api' +
      '/GetLineList';
    //console.log('store.state.userInfo.USER_ID:', store.state.userInfo.USER_ID);

    const {data}: {data: {CODE: string; MESSAGE: string}} = await axios.get(
      url,
      {
        params: {
          UserID: store.state.userInfo.USER_ID,
          Token: store.state.userInfo.TOKEN,
        },
      },
    );

    if (data.CODE === '0') {
      console.log(TAG, 'Lỗi:', data.MESSAGE);
      return ret;
    }
    store.setState(state => {
      state.meter.listLine = data as unknown as PropsLineServer[];
      return {...state};
    });

    //console.log('dat:', data);
  } catch (err: any) {
    console.log(TAG, 'Lỗi:', err.message);
  }

  return ret;
}

export async function getMeterListMissByLine(
  lineID: string,
  dateMiss: Date,
): Promise<PropsResponse> {
  const ret = {} as PropsResponse;

  ret.succeed = false;
  ret.message = '';

  try {
    //GetMeterAccount(string UserAccount, string Token)
    const url =
      'http://' +
      store.state.appSetting.server.host +
      ':' +
      store.state.appSetting.server.port +
      '/api' +
      '/GetMeterListByLine';
    console.log('store.state.userInfo.USER_ID:', store.state.userInfo.USER_ID);
    console.log('tets:', {
      LineID: lineID,
      DateMiss: GetFormatDate(dateMiss),
      Token: store.state.userInfo.TOKEN,
    });

    const {data}: {data: {CODE: string; MESSAGE: string}} = await axios.get(
      url,
      {
        params: {
          LineID: lineID,
          DateMiss: GetFormatDate(dateMiss),
          Token: store.state.userInfo.TOKEN,
        },
      },
    );

    if (data.CODE === '0') {
      console.log(TAG, 'Lỗi:', data.MESSAGE);
      return ret;
    } else {
      //console.log(TAG, 'abc:', data);
    }

    ret.succeed = true;
    ret.data = data as unknown as PropsInfoWM[];

    //console.log('dat:', data);
  } catch (err: any) {
    console.log(TAG, 'Lỗi:', err.message);
  }

  return ret;
}

export async function checkNetworkStatus(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();

    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);

    return state.isConnected ?? false;
  } catch (err) {
    return false;
  }
}
