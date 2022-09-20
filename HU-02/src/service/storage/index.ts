import AsyncStorage from '@react-native-community/async-storage';
import { PATH_EXECUTE_CSDL, PATH_EXPORT_XML } from '../../shared/path';

const KEY_SETTING = 'APP_SETTING';
const TAG = 'STORAGE SERVICE:';
const KEY_LAST_PATH_IMPORT = 'LAST_PATH_IMPORT';
const KEY_SERI_READ_PARAM = 'SERI_READ_PARAMS';

export type PropsSettingAndAlarm = {
  typeAlarm: 'Value' | 'Percent';
  upperThresholdPercent: string;
  lowerThresholdPercent: string;
  upperThresholdValue: string;
  lowerThresholdValue: string;
};

export type PropsAppSetting = {
  password: string;
  passwordAdmin: string;
  numRetriesRead: string;
  CMISPath: string;
  IP: string;
  Port: string;
};

export const getDefaultStorageValue = (): PropsAppSetting => {
  const storageVariable = {} as PropsAppSetting;

  storageVariable.CMISPath = '';
  storageVariable.numRetriesRead = '1';
  storageVariable.password = '123456';
  storageVariable.IP = '222.252.14.147';
  storageVariable.Port = '6060';
  storageVariable.password =
    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
  storageVariable.passwordAdmin =
    'fa656a64a169bd0f37f44fc4c42e62f8b533827eff4af4f2050b238da70b0bf3';
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
        storageVariable.password = storageVar.password;
        storageVariable.IP = storageVar.IP;
        storageVariable.Port = storageVar.Port;

        //console.log('storageVariable:', storageVar);
        for (let i in storageVariable) {
          if (storageVariable[i] === undefined || storageVariable[i] === null) {
            storageVariable = getDefaultStorageValue();
            //console.log('meet here:', i);
            break;
          }
        }
      } else {
        //console.log('meet here 1');
        storageVariable = getDefaultStorageValue();
      }
    } catch (err) {
      console.log(TAG, err.message);
      //console.log('meet here 2');
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
