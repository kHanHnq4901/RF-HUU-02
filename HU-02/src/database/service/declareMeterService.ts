import {PropsAddMeter} from '../../service/api';
import {PropsDeclareMeterEntity} from '../entity/declareMeterEntity';
import {DeclareMeterRepository} from '../repository/declareMeterRepository';
const TAG = 'DECLARE METER service:';

export async function AddDeclareMeter(props: PropsAddMeter) {
  try {
    const entity: PropsDeclareMeterEntity = {
      ...props,
      ID: props.MeterNo,
      IS_SENT: false,
    };
    const rest = await DeclareMeterRepository.save(entity);
    if (rest) {
      console.log('save decalre meter to db succeed');
    }
  } catch (err: any) {
    console.log(TAG, 'Lỗi:', err.message);
  }
}
