import {dataDBTable, PropsDataModel} from '../../database/model';
import {PropsCondition, PropsConditions} from '../../database/repository';
import {CMISKHServices} from '../../database/service';
import {TYPE_READ_RF} from '../hhu/defineEM';

export type PropsUpdateData2DB = {
  seri: string;
  data: PropsDataModel;
  typeRead: TYPE_READ_RF;
  note?: string;
};

export async function updateDataToDB(
  props: PropsUpdateData2DB,
): Promise<boolean> {
  const conditions: PropsConditions = [];
  let condition = {
    data: {},
  } as PropsCondition;
  condition.data[dataDBTable.NO_METER.id] = props.seri;
  condition.logic = '=';
  condition.behindOperator = 'AND';

  conditions.push(condition);

  const valueSet = {};

  valueSet[dataDBTable.DATA.id] = props.data;
  valueSet[dataDBTable.TYPE_READ.id] = props.typeRead;
  if (props.note) {
    valueSet[dataDBTable.NOTE.id] = props.note;
  }

  const res = await CMISKHServices.update(conditions, valueSet);

  return res;
}

export async function updateReadFailToDb(seri: string) {
  const conditions: PropsConditions = [];
  let condition = {
    data: {},
  } as PropsCondition;
  condition.data[dataDBTable.NO_METER.id] = seri;
  condition.logic = '=';
  condition.behindOperator = 'AND';

  conditions.push(condition);

  const valueSet = {};
  valueSet[dataDBTable.TYPE_READ.id] = TYPE_READ_RF.READ_FAILED;

  const res = await CMISKHServices.update(conditions, valueSet);

  return res;
}
