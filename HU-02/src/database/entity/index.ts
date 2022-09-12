import { PropsXmlModel } from '../../xml';

export type PropsAddMoreEntity = {
  TT: number;
  id: string;
  RF: string;
  LoaiDoc: string;
  GhiChu: string;
};

export type PropsKHCMISEntity = PropsXmlModel & PropsAddMoreEntity;

export const TABLE_NAME = 'KHCMIS';

export const dumyEntity: PropsKHCMISEntity = {
  MA_NVGCS: '',
  MA_KHANG: '',
  MA_DDO: '',
  MA_DVIQLY: '',
  MA_GC: '',
  MA_QUYEN: '',
  MA_TRAM: '',
  BOCSO_ID: '',
  LOAI_BCS: '',
  LOAI_CS: '',
  TEN_KHANG: '',
  DIA_CHI: '',
  MA_NN: '',
  SO_HO: '',
  MA_CTO: '',
  SERY_CTO: '',
  HSN: '',
  CS_CU: '',
  TTR_CU: '',
  SL_CU: '',
  SL_TTIEP: '',
  NGAY_CU: '',
  CS_MOI: '',
  TTR_MOI: '',
  SL_MOI: '',
  CHUOI_GIA: '',
  KY: '',
  THANG: '',
  NAM: '',
  NGAY_MOI: '',
  NGUOI_GCS: '',
  SL_THAO: '',
  KIMUA_CSPK: '',
  MA_COT: '',
  SLUONG_1: '',
  SLUONG_2: '',
  SLUONG_3: '',
  SO_HOM: '',
  PMAX: '',
  NGAY_PMAX: '',
  X: '',
  Y: '',
  Z: '',
  TT: 0,
  id: '',
  RF: '',
  LoaiDoc: '',
  GhiChu: '',
};
