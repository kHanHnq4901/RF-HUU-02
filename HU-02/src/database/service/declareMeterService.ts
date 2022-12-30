import {AddMeter, PropsAddMeter} from '../../service/api';
import {
  PropsDeclareMeterEntity,
  dumyEntity,
} from '../entity/declareMeterEntity';
import {DeclareMeterRepository} from '../repository/declareMeterRepository';
import {showToast} from '../../util/index';
const TAG = 'DECLARE METER service:';

export async function AddDeclareMeter(props: PropsAddMeter) {
  try {
    const entity: PropsDeclareMeterEntity = {
      ...props,
      ID: props.MeterNo,
      IS_SENT: false,
      DATE_CREATE: new Date().toLocaleString('vi'),
    };
    const rest = await DeclareMeterRepository.save(entity);
    if (rest) {
      console.log('save decalre meter to db succeed');
    }
  } catch (err: any) {
    console.log(TAG, 'Lỗi:', err.message);
  }
}

export async function GetUnsentDeclareMeter(): Promise<PropsAddMeter[]> {
  const meterUnDeclare: PropsAddMeter[] = [];
  try {
    const decalareEntitys: PropsDeclareMeterEntity[] =
      await DeclareMeterRepository.findAll(undefined, [
        {
          behindOperator: 'AND',
          logic: '!=',
          data: {
            IS_SENT: true,
          },
        },
      ]);
    //console.log('decalareEntitys:', decalareEntitys);

    for (let entiy of decalareEntitys) {
      const meter = {} as PropsAddMeter;
      for (let key in dumyEntity) {
        meter[key] = entiy[key];
      }
      meterUnDeclare.push(meter);
    }
  } catch (err: any) {
    console.log(TAG, 'Err:', err.message);
  } finally {
  }

  return meterUnDeclare;
}

async function UpdateSentSucceeded(meter: PropsAddMeter) {
  const rest = await DeclareMeterRepository.update(
    [
      {
        data: {
          ID: meter.MeterNo,
        },
        logic: '=',
        behindOperator: 'AND',
      },
    ],
    {
      IS_SENT: true,
    },
  );
  if (rest === true) {
    console.log('Update sent succeed');
  }
}

let isBusy = false;
export async function SendUnsentDeclareMeterProcess() {
  if (isBusy) {
    return;
  }
  isBusy = true;
  try {
    const meterUnDeclare = await GetUnsentDeclareMeter();
    console.log(TAG, 'Number UnDecalre Meter:', meterUnDeclare.length);
    let succeed = 0;
    for (let meter of meterUnDeclare) {
      const ret = await AddMeter(meter);
      if (ret.bSucceeded === true) {
        UpdateSentSucceeded(meter);
        succeed++;
      } else {
        //console.log(TAG, 'Error :', ret);
      }
    }
    if (succeed > 0) {
      showToast('Đẩy thành công ' + succeed + ' công tơ chưa khai báo');
    }
  } catch (err: any) {
    console.log(TAG, 'Err:', err.message);
  } finally {
    isBusy = false;
  }
}

export async function ClearAllDeclareMeterForGarbage() {
  DeclareMeterRepository.delete([
    {
      behindOperator: 'AND',
      logic: '=',
      data: {
        IS_SENT: true,
      },
    },
  ]);
}
