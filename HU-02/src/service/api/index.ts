import axios from 'axios';
import {showAlert, showToast} from '../../util/index';
import {store} from '../../component/drawer/drawerContent/controller';
import {PropsDataModel} from '../../database/model';
import {GetFormatDate, GetFormatTime} from '../user/util';
import {ObjSend, onOKAlertNeedUpdatePress} from '../hhu/Ble/hhuFunc';

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
    const url = `http://${store.state.appSetting.hhu.host}:${
      store.state.appSetting.hhu.port
    }/HU_02/version.txt?timestamp=${new Date().getTime()}`;
    //console.log('url read version:', url);

    const rest = await axios.get(url);
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
    const {data}: {data: string} = await axios.get(
      `http://${store.state.appSetting.hhu.host}:${
        store.state.appSetting.hhu.port
      }/HU_02/firmware.txt?timestamp=${new Date().getTime()}`,
    );
    ret.bResult = true;
    ret.strFirmware = data;
  } catch (err) {
    ret.message = err.message;
  }

  return ret;
};

export async function checkUpdateHHU(props?: PropsReturnGetVerion) {
  try {
    if (store.state.hhu.shortVersion !== '') {
      let currentVersion = store.state.hhu.shortVersion;
      let restVersion = {} as PropsReturnGetVerion;
      if (props) {
        restVersion = props;
      } else {
        restVersion = await getVersion();
      }
      if (restVersion.bResult === true) {
        if (currentVersion !== restVersion.version) {
          let status = `Đã có phiên bản mới cho thiết bị cầm tay ${restVersion.version}\r\n`;
          if (restVersion.priority === 'Cao') {
            status += '(Quan trọng)';
            ObjSend.isNeedUpdate = true;
            showAlert(status, onOKAlertNeedUpdatePress);
          } else {
            ObjSend.isNeedUpdate = false;
            showAlert(status);
          }
          console.log('rest version:', restVersion.version);
          console.log('current version:', currentVersion);
        } else {
          console.log('Không có bản cập nhật nào');
        }
      }
      //console.log('rest version:', rest);
    }
  } catch (err: any) {
    console.log(TAG, err.message);
  }
}

type PropsPushDataToServer = {
  seri: string;
  data: PropsDataModel;
};
export async function PushDataToServer(
  props: PropsPushDataToServer,
): Promise<boolean> {
  //SaveActiveTotal(string ModuleNo, string DataTime, string ActiveTotal, string NegactiveTotal, string Token)

  const url = `http://${store.state.appSetting.server.host}:${
    store.state.appSetting.server.port
  }/api/SaveActiveTotal?timestamp=${new Date().getTime()}`;
  let res: boolean = true;
  let totalSucceed = 0;
  for (let data of props.data) {
    // console.log('kkk:', {
    //   ModuleNo: props.seri,
    //   DataTime: GetFormatTime(new Date(data.time)),
    //   ActiveTotal: data.cwRegister.toString(),
    //   NegactiveTotal: data.uCwRegister.toString(),
    //   Token: store.state.userInfo.TOKEN,
    // });

    const rest = await axios.get(url, {
      params: {
        ModuleNo: props.seri,
        DataTime: GetFormatTime(new Date(data.time)),
        ActiveTotal: data.cwRegister.toString(),
        NegactiveTotal: data.uCwRegister.toString(),
        Token: store.state.userInfo.TOKEN,
      },
    });
    const ret = rest.data as {CODE: string; MESSAGE: string};
    if (ret.CODE === '1') {
      totalSucceed++;
      //return true;
    } else {
      console.log(TAG, 'err:', ret);

      //return false;
    }
  }

  if (totalSucceed === props.data.length) {
    res = true;
    console.log('push data to server succeed seri ' + props.seri);
  } else {
    res = false;
    console.log(
      'push data to server faile seri ' +
        props.seri +
        ` ${totalSucceed}/${props.data.length}`,
    );
  }

  return res;
}

export type PropsDeclareMeter = {
  seri: string;
  lat: string;
  long: string;
};

export async function DeclareMeter(props: PropsDeclareMeter): Promise<boolean> {
  //SaveActiveTotal(string ModuleNo, string DataTime, string ActiveTotal, string NegactiveTotal, string Token)

  try {
    const url = `http://${store.state.appSetting.server.host}:${store.state.appSetting.server.port}/api/SaveCoordinate`;

    const rest = await axios.get(url, {
      params: {
        MeterNo: props.seri,
        Coordinate: props.lat + ',' + props.long,
        Token: store.state.userInfo.TOKEN,
      },
    });
    const ret = rest.data as {CODE: string; MESSAGE: string};
    if (ret.CODE === '1') {
      return true;
    } else {
      console.log(TAG, 'err:', ret);

      return false;
    }
  } catch (err) {
    console.log(TAG, 'err: ', err.message);

    return false;
  }
}
