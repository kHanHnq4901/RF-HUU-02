import axios from 'axios';

type PropsReturnGetVerion = {
  bResult: boolean;
  message: string;
  version: string;
  dateIssue: string;
  priority: 'Cao' | 'Bình thường';
};

type PropsReturnGetFirmware = {
  bResult: boolean;
  message: string;
  strFirmware: string;
};

const TAG = 'API:';

const getTimeFromString = (time: string): string | undefined => {
  //console.log('time:', time);
  let index = 0;
  const year = Number(time.substring(index, index + 4));

  index += 4;
  const month = time.substring(index, index + 2);
  index += 2;
  const date = time.substring(index, index + 2);
  index += 2;
  const hour = time.substring(index, index + 2);
  index += 2;
  const minute = time.substring(index, index + 2);
  index += 2;
  let second: string;
  if (time.length > 12) {
    second = time.substring(index, index + 2);
    index += 2;
  } else {
    second = '00';
  }
  const str =
    year.toString() +
    '-' +
    month +
    '-' +
    date +
    ' ' +
    hour +
    ':' +
    minute +
    ':' +
    second;

  return str;
};

export const getVersion = async (): Promise<PropsReturnGetVerion> => {
  const ret = {} as PropsReturnGetVerion;
  ret.bResult = false;
  ret.message = '';
  ret.version = '';
  ret.dateIssue = '';
  ret.priority = 'Cao';
  try {
    const rest = await axios.get(
      `http://222.252.14.147:5050/HU_02/version.txt?timestamp=${new Date().getTime()}`,
    );
    const arr: string[] = rest?.data.split('_');
    if (arr.length !== 3) {
      console.log('error arr');
      ret.message = 'Lỗi dữ liệu';
    } else {
      console.log(arr);
      const strDate = getTimeFromString(arr[0]);
      const strVersion = arr[1];
      ret.bResult = true;
      ret.version = strVersion;
      ret.dateIssue = strDate as string;
      ret.priority = arr[2] === '0' ? 'Bình thường' : 'Cao';
      //   console.log('date:', strDate);
      //   console.log('version:', strVersion);
      //status = 'Version: ' + strVersion + '. Ngày phát hành: ' + strDate;
    }
  } catch (err) {
    console.log(TAG, err);
    ret.message = 'Lỗi: ' + err.message;
  }

  return ret;
};

export const getStringFirmware = async (): Promise<PropsReturnGetFirmware> => {
  const ret: PropsReturnGetFirmware = {
    bResult: false,
    message: '',
    strFirmware: '',
  };

  try {
    const { data }: { data: string } = await axios.get(
      `http://222.252.14.147:5050/HU_02/firmware.txt?timestamp=${new Date().getTime()}`,
    );
    ret.bResult = true;
    ret.strFirmware = data;
  } catch (err) {
    ret.message = err.message;
  }

  return ret;
};
