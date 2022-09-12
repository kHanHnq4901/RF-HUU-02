import { PropsAddMoreEntity } from '../entity';

type PropsCell = {
  id: keyof PropsTable;
};

type PropsTable = {
  TT: PropsCell;
  MA_KHANG: PropsCell;
  MA_DDO: PropsCell;
  MA_DVIQLY: PropsCell;
  MA_QUYEN: PropsCell;
  MA_TRAM: PropsCell;
  LOAI_BCS: PropsCell;
  TEN_KHANG: PropsCell;
  DIA_CHI: PropsCell;
  MA_CTO: PropsCell;
  SERY_CTO: PropsCell;
  CS_CU: PropsCell;
  SL_CU: PropsCell;
  SL_TTIEP: PropsCell;
  NGAY_CU: PropsCell;
  CS_MOI: PropsCell;
  SL_MOI: PropsCell;
  KY: PropsCell;
  THANG: PropsCell;
  NAM: PropsCell;
  NGAY_MOI: PropsCell;
  SL_THAO: PropsCell;
  MA_COT: PropsCell;
  PMAX: PropsCell;
  NGAY_PMAX: PropsCell;
  RF: PropsCell;
  LoaiDoc: PropsCell;
  GhiChu: PropsCell;
};

export const dataDBTabel: PropsTable = {
  TT: {
    id: 'TT',
  },
  MA_KHANG: {
    id: 'MA_KHANG',
  },
  MA_DDO: {
    id: 'MA_DDO',
  },
  MA_DVIQLY: {
    id: 'MA_DVIQLY',
  },
  MA_QUYEN: {
    id: 'MA_QUYEN',
  },
  MA_TRAM: {
    id: 'MA_TRAM',
  },
  LOAI_BCS: {
    id: 'LOAI_BCS',
  },
  TEN_KHANG: {
    id: 'TEN_KHANG',
  },
  DIA_CHI: {
    id: 'DIA_CHI',
  },
  MA_CTO: {
    id: 'MA_CTO',
  },
  SERY_CTO: {
    id: 'SERY_CTO',
  },
  CS_CU: {
    id: 'CS_CU',
  },
  SL_CU: {
    id: 'SL_CU',
  },
  SL_TTIEP: {
    id: 'SL_TTIEP',
  },
  NGAY_CU: {
    id: 'NGAY_CU',
  },
  CS_MOI: {
    id: 'CS_MOI',
  },
  SL_MOI: {
    id: 'SL_MOI',
  },
  KY: {
    id: 'KY',
  },
  THANG: {
    id: 'THANG',
  },
  NAM: {
    id: 'NAM',
  },
  NGAY_MOI: {
    id: 'NGAY_MOI',
  },
  SL_THAO: {
    id: 'SL_THAO',
  },
  MA_COT: {
    id: 'MA_COT',
  },
  PMAX: {
    id: 'PMAX',
  },
  NGAY_PMAX: {
    id: 'NGAY_PMAX',
  },
  RF: {
    id: 'RF',
  },
  LoaiDoc: {
    id: 'LoaiDoc',
  },
  GhiChu: {
    id: 'GhiChu',
  },
};

export type PropsKHCMISModel = {
  MA_KHANG: string;
  MA_QUYEN: string;
  MA_TRAM: string;
  LOAI_BCS: string;
  TEN_KHANG: string;
  DIA_CHI: string;
  MA_CTO: string;
  SERY_CTO: string;
  CS_CU: number;
  SL_CU: number;
  SL_TTIEP: number;
  CS_MOI: number;
  NGAY_MOI: string;
  MA_COT: string;
  PMAX: number;
  NGAY_PMAX: string;
} & PropsAddMoreEntity;

const dumy: PropsKHCMISModel = {
  MA_KHANG: '',
  MA_QUYEN: '',
  MA_TRAM: '',
  LOAI_BCS: '',
  TEN_KHANG: '',
  DIA_CHI: '',
  MA_CTO: '',
  SERY_CTO: '',
  CS_CU: 0,
  SL_CU: 0,
  SL_TTIEP: 0,
  CS_MOI: 0,
  NGAY_MOI: '',
  MA_COT: '',
  PMAX: 0,
  NGAY_PMAX: '',
  RF: '',
  LoaiDoc: '',
  GhiChu: '',
  TT: 0,
  id: '',
};

export type PropsTypeOf =
  | 'undefined'
  | 'object'
  | 'boolean'
  | 'number'
  | 'bigint'
  | 'string'
  | 'symbol'
  | 'function'
  | 'object';

export const getTypeOfColumn = (id: string): PropsTypeOf => {
  return typeof dumy[id];
};

export type PropsPercentRead = {
  readSucceed: number;
  haveNotRead: number;
  readFailed: number;
  writeByHand: number;
  abnormalRead: number;
};

const getFiledKHCMIS = (): string[] => {
  const fields: string[] = [];
  for (let i in dumy) {
    fields.push(i);
  }
  return fields;
};

export const KHCMISModelFields = getFiledKHCMIS();
