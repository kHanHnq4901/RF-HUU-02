import {CMISKHServices} from '.';
import {PushDataToServer} from '../../service/api';
import {updateSentToDb} from '../../service/database';
import {showToast} from '../../util/index';
import {PropsKHCMISModel} from '../model';
const TAG = 'DATA METER service:';

export async function GetDataUnsentMeter(): Promise<PropsKHCMISModel[]> {
  let meterUnSent: PropsKHCMISModel[] = [];
  try {
    meterUnSent = await CMISKHServices.findAll(undefined, [
      {
        behindOperator: 'AND',
        logic: '!=',
        data: {
          IS_SENT: true,
        },
      },
    ]);
  } catch (err: any) {
    console.log(TAG, 'Err:', err.message);
  } finally {
  }

  return meterUnSent;
}
let isBusy = false;
export async function SendDataUnsentMeterProcess() {
  if (isBusy) {
    return;
  }
  isBusy = true;
  try {
    const dataMeterUnsent = await GetDataUnsentMeter();
    console.log(TAG, 'Number unsent data Meter:', dataMeterUnsent.length);
    let succeed = 0;
    for (let meter of dataMeterUnsent) {
      const ret = await PushDataToServer({
        seri: meter.NO_METER,
        data: meter.DATA,
      });
      if (ret === true) {
        updateSentToDb(meter.NO_METER, meter.DATE_QUERY, true);
        succeed++;
      } else {
        //console.log(TAG, 'Error :', ret);
      }
    }
    if (succeed > 0) {
      showToast('Đẩy thành công ' + succeed + ' công tơ chưa được gửi dữ liệu');
    }
  } catch (err: any) {
    console.log(TAG, 'Err:', err.message);
  } finally {
    isBusy = false;
  }
}

export async function ClearAllSentDataMeterForGarbage() {
  CMISKHServices.delete([
    {
      behindOperator: 'AND',
      logic: '=',
      data: {
        IS_SENT: true,
      },
    },
  ]);
}
