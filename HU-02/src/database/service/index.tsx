import {PropsKHCMISEntity} from '../entity';
import {
  dataDBTable,
  KHCMISModelFields,
  PropsKHCMISModel,
  PropsPercentRead,
  PropsTypeOf,
} from '../model';
import {KHCMISRepository, PropsConditions} from '../repository';

interface ICMISKHServices {
  findAll: (
    pagination?: PropsPagination,
    condition?: PropsConditions,
  ) => Promise<PropsKHCMISModel[]>;
  findByColumn: (
    filter: PropsFilter,
    pagination?: PropsPagination,
    sort?: PropsSorting,
  ) => Promise<PropsKHCMISModel[]>;
  findUniqueValuesInColumn: (
    filter: PropsFilter,
    pagination?: PropsPagination,
    sort?: PropsSorting,
  ) => Promise<any[]>;
  update: (
    condition: PropsConditions,
    valueSet: {[key: string]: any},
  ) => Promise<boolean>;
  delete: (condition: PropsConditions) => Promise<boolean>;
  getPercentRead: () => Promise<PropsPercentRead>;
  save: (item: PropsKHCMISModel) => Promise<boolean>;
}

export type PropsPagination = {
  page: number;
  totalPage?: number;
  itemPerPage: number;
};

export type PropsSorting = 'ascending' | 'descending';

export type PropsFilter = {
  idColumn: string;
  valueString?: string;
  startNumber?: string;
  endNumber?: string;
};

const convertEntity2Model = (entity: PropsKHCMISEntity): PropsKHCMISModel => {
  const model = {} as PropsKHCMISModel;
  for (let i = 0; i < KHCMISModelFields.length; i++) {
    model[KHCMISModelFields[i]] = entity[KHCMISModelFields[i]];
  }
  return model;
};

export const CMISKHServices = {} as ICMISKHServices;

CMISKHServices.findAll = async (
  pagination?: PropsPagination,
  condition?: PropsConditions,
) => {
  const items: PropsKHCMISModel[] = [];
  const entity = await KHCMISRepository.findAll(pagination, condition);
  for (let i = 0; i < entity.length; i++) {
    items.push(convertEntity2Model(entity[i]));
  }
  return items;
};

CMISKHServices.findByColumn = async (
  filter: PropsFilter,
  pagination?: PropsPagination,
  sort?: PropsSorting,
): Promise<PropsKHCMISModel[]> => {
  const items: PropsKHCMISModel[] = [];
  const entity = await KHCMISRepository.findByColumn(filter, pagination, sort);
  for (let i = 0; i < entity.length; i++) {
    items.push(convertEntity2Model(entity[i]));
  }
  return items;
};

CMISKHServices.findUniqueValuesInColumn = async (
  filter: PropsFilter,
  pagination?: PropsPagination,
  sort?: PropsSorting,
): Promise<PropsKHCMISModel[]> => {
  return await KHCMISRepository.findUniqueValuesInColumn(
    filter,
    pagination,
    sort,
  );
};

CMISKHServices.update = async (
  condition: PropsConditions,
  valueSet: {[key: string]: any},
): Promise<boolean> => {
  return await KHCMISRepository.update(condition, valueSet);
};
CMISKHServices.delete = async (
  condition: PropsConditions,
): Promise<boolean> => {
  return await KHCMISRepository.delete(condition);
};

CMISKHServices.getPercentRead = async () => {
  const result = await KHCMISRepository.getPercentRead();
  //console.log('resultbb:', result);
  return result;
};
CMISKHServices.save = async (item: PropsKHCMISModel) => {
  const entity = {} as PropsKHCMISEntity;

  for (let key in dataDBTable) {
    entity[key] = item[key];
  }

  return await KHCMISRepository.save(entity);
};
