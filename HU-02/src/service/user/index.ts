import { store } from '../../component/drawer/drawerContent/controller';
import { PropsStoreMeter } from '../../store';
import axios from 'axios';
import { GetFormatDate } from './util';
import NetInfo from '@react-native-community/netinfo';
import { endPoints, getUrl } from '../api';
import VersionCheck from 'react-native-version-check';
import { Linking, Platform } from 'react-native';
import { showAlert } from '../../util';

const TAG = 'USER Service:';

export type PropsResponse = {
  succeed: boolean;
  message: string;
  data: any;
};

export enum USER_ROLE_TYPE {
  ADMIN = '0',
  STAFF = '1',
  CUSTOMER = '2',
}

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
  USER_TYPE: USER_ROLE_TYPE;
  ROLE_NAME: 'DVKH' | 'UNKNOWN';
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
    const url = getUrl(endPoints.getMeterAccount);
    const { data }: { data: { CODE: string; MESSAGE: string } } =
      await axios.get(url, {
        params: {
          UserAccount: store.state.userInfo.USER_ACCOUNT,
          Token: store.state.userInfo.TOKEN,
        },
      });

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
      return { ...state };
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
    const url = getUrl(endPoints.getLineList);
    //console.log('store.state.userInfo.USER_ID:', store.state.userInfo.USER_ID);

    const { data }: { data: { CODE: string; MESSAGE: string } } =
      await axios.get(url, {
        params: {
          UserID: store.state.userInfo.USER_ID,
          Token: store.state.userInfo.TOKEN,
        },
      });

    if (data.CODE === '0') {
      console.log(TAG, 'Lỗi:', data.MESSAGE);
      return ret;
    }
    store.setState(state => {
      state.meter.listLine = data as unknown as PropsLineServer[];
      return { ...state };
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
    const url = getUrl(endPoints.getMeterByLine);
    console.log('store.state.userInfo.USER_ID:', store.state.userInfo.USER_ID);

    const { data }: { data: { CODE: string; MESSAGE: string } } =
      await axios.get(url, {
        params: {
          LineID: lineID,
          DateMiss: GetFormatDate(dateMiss),
          Token: store.state.userInfo.TOKEN,
        },
      });

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

export async function checkUpdateFromStore() {
  console.log('checkUpdateFromStore .....');

  try {
    const platform = Platform.OS + ': ';

    const latestVersion = await VersionCheck.getLatestVersion();
    const currentVersion = VersionCheck.getCurrentVersion();

    let rest = await VersionCheck.needUpdate({
      depth: 2,
      currentVersion: currentVersion,
      latestVersion: latestVersion,
    });

    console.log('currentVersion:', currentVersion);
    console.log('latestVersion:', latestVersion);

    if (rest.isNeeded) {
      //2.1.0 && 2.2.0
      let url = '';
      if (Platform.OS === 'android') {
        url = await VersionCheck.getStoreUrl();
      } else {
        url = 'https://apps.apple.com/us/app/hu-02-esoft/id6461162736';
      }

      showAlert('Ứng dụng đã có phiên bản mới ' + latestVersion, {
        label: 'Cập nhật',
        func: () => {
          Linking.openURL(url); // open store if update is needed.
        },
      });
    } else {
      //2.1.0 && 2.1.1
      rest = await VersionCheck.needUpdate({
        depth: 3,
        currentVersion: currentVersion,
        latestVersion: latestVersion,
      });
      if (rest.isNeeded) {
        console.log(platform + 'Đã có phiên bản cập nhật nhỏ của ứng dụng');
      } else {
      }
    }
  } catch (err) {
    console.log(TAG, err);
  }
}
