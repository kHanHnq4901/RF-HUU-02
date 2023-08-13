import AsyncStorage from '@react-native-community/async-storage';
import { PATH_EXECUTE_CSDL, PATH_EXPORT_XML } from '../../shared/path';
import { aes_128_dec, aes_128_en } from '../../util/aes128';
import { ByteArrayFromHexString, ByteArrayToString } from '../../util/index';
import { PropsKeyAesStore, getDefaultKeyAesStore } from '../../store';
import { Buffer } from 'buffer';

const KEY_SETTING = 'APP_SETTING';
const TAG = 'STORAGE SERVICE:';
const KEY_LAST_PATH_IMPORT = 'LAST_PATH_IMPORT';
const KEY_SERI_READ_PARAM = 'SERI_READ_PARAMS';
export const KEY_USER = 'KEY_USER';

export type PropsSettingAndAlarm = {
  typeAlarm: 'Value' | 'Percent';
  upperThresholdPercent: string;
  lowerThresholdPercent: string;
  upperThresholdValue: string;
  lowerThresholdValue: string;
};

export type PropsKeyAesStorage = {
  keyOptical: string;
  keyRadio: string;
};

export type PropsAppSetting = {
  userAdmin: string;
  passwordAdmin: string;
  numRetriesRead: string;
  CMISPath: string;
  server: {
    host: string;
    port: string;
  };
  hhu: {
    host: string;
    port: string;
  };
  keyAes: PropsKeyAesStorage;
};

export function getKeyToSaveStorage(
  keyAesStore: PropsKeyAesStore,
): PropsKeyAesStorage {
  const key: Buffer = Buffer.from([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6,
  ]);

  const dataKeyOptical = Buffer.from(keyAesStore.keyOptical);
  const dataKeyRadio = Buffer.from(keyAesStore.keyRadio);

  aes_128_en(key, dataKeyOptical, 0);
  aes_128_en(key, dataKeyRadio, 0);

  const keyStorage: PropsKeyAesStorage = {
    keyOptical: ByteArrayToString(dataKeyOptical, 0, 16, 16),
    keyRadio: ByteArrayToString(dataKeyRadio, 0, 16, 16),
  };

  return keyStorage;
}

export function convertKeyStorageToKeyStore(
  keyStorage: PropsKeyAesStorage,
): PropsKeyAesStore {
  try {
    const keyStore = {} as PropsKeyAesStore;

    const key: Buffer = Buffer.from([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6,
    ]);

    const keyOptical = ByteArrayFromHexString(keyStorage.keyOptical);
    const keyRadio = ByteArrayFromHexString(keyStorage.keyRadio);

    aes_128_dec(key, keyOptical, 0);
    aes_128_dec(key, keyRadio, 0);

    keyStore.keyOptical = keyOptical;
    keyStore.keyRadio = keyRadio;

    return keyStore;
  } catch (err: any) {
    console.log(TAG, err.message);
    return getDefaultKeyAesStore();
  }
}

export const getDefaultStorageValue = (): PropsAppSetting => {
  const storageVariable = {} as PropsAppSetting;

  storageVariable.CMISPath = '';
  storageVariable.numRetriesRead = '1';
  storageVariable.server = {
    host: '', //'api.emic.com.vn',
    port: '', //'80',
  };
  storageVariable.userAdmin =
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
  storageVariable.passwordAdmin =
    'fa656a64a169bd0f37f44fc4c42e62f8b533827eff4af4f2050b238da70b0bf3';

  storageVariable.hhu = {
    host: '222.252.14.147',
    port: '5050',
  };

  storageVariable.keyAes = getKeyToSaveStorage(getDefaultKeyAesStore());

  // storageVariable.showResultOKInWriteData = false;
  // storageVariable.setting = {
  //   typeAlarm: 'Percent',
  //   upperThresholdPercent: '150',
  //   lowerThresholdPercent: '0',
  //   lowerThresholdValue: '0',
  //   upperThresholdValue: '200',
  // };

  return storageVariable;
};

export const updateValueAppSettingFromNvm =
  async (): Promise<PropsAppSetting> => {
    let storageVariable = {} as PropsAppSetting;
    try {
      const result = await AsyncStorage.getItem(KEY_SETTING);
      if (result) {
        const storageVar = JSON.parse(result) as PropsAppSetting;

        storageVariable.CMISPath = storageVar.CMISPath;
        storageVariable.numRetriesRead = storageVar.numRetriesRead;
        storageVariable.userAdmin = storageVar.userAdmin;
        storageVariable.passwordAdmin = storageVar.passwordAdmin;
        storageVariable.server = {
          host: storageVar.server.host,
          port: storageVar.server.port,
        };
        storageVariable.hhu = {
          host: storageVar.hhu.host,
          port: storageVar.hhu.port,
        };

        storageVariable.keyAes = storageVar.keyAes;

        for (let i in storageVariable) {
          if (storageVariable[i] === undefined || storageVariable[i] === null) {
            storageVariable = getDefaultStorageValue();
            console.log(TAG, 'value is undefined:', i);
            break;
          }
        }
      } else {
        console.log('no value for key in storage');
        storageVariable = getDefaultStorageValue();
      }
    } catch (err) {
      console.log(TAG, err.message);
      console.log(TAG, 'error get storage');
      storageVariable = getDefaultStorageValue();
    }

    return storageVariable;
  };

export const saveValueAppSettingToNvm = async (value: PropsAppSetting) => {
  try {
    console.log('value to asyncstorage:');
    await AsyncStorage.setItem(KEY_SETTING, JSON.stringify(value));
  } catch (err) {
    console.log(TAG, err.message);
  }
};

export const savePathImport = async (path: string) => {
  try {
    console.log('save path to asyncstorage:');
    await AsyncStorage.setItem(KEY_LAST_PATH_IMPORT, path);
  } catch (err) {
    console.log(TAG, err.message);
  }
};

export const getLastPathImport = async (): Promise<string> => {
  try {
    console.log('get last path to asyncstorage:');
    let path = await AsyncStorage.getItem(KEY_LAST_PATH_IMPORT);
    if (path) {
      return path;
    } else {
    }
  } catch (err) {
    console.log(TAG, err.message);
  }
  return PATH_EXPORT_XML + '/' + 'Trống.XML';
};

export const saveArrSeri = async (arrSeri: string[]) => {
  try {
    //console.log('save path to asyncstorage:');
    await AsyncStorage.setItem(KEY_SERI_READ_PARAM, JSON.stringify(arrSeri));
  } catch (err) {
    console.log(TAG, err.message);
  }
};

export const getArrSeri = async (): Promise<string[]> => {
  try {
    console.log('get last path to asyncstorage:');
    let arrSeriString = await AsyncStorage.getItem(KEY_SERI_READ_PARAM);
    if (!arrSeriString) {
    } else {
      const arrSEri: string[] = JSON.parse(arrSeriString);
      return arrSEri;
    }
  } catch (err) {
    console.log(TAG, err.message);
  }
  return [];
};
