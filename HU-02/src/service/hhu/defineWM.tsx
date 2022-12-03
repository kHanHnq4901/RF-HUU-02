export type TYPE_METER = 'Đồng hồ' | 'Repeater' | null;

export type PropsLabel =
  | 'Seri'
  | 'RTC'
  | 'Nhiệt độ'
  | 'Điện áp'
  | 'Thời điểm chốt'
  | 'Thời điểm chốt (full time)'
  | 'Xuôi'
  | 'Ngược'
  | 'Phiên bản'
  | 'Rssi'
  | 'Số bản tin chốt'
  | 'Chu kỳ chốt'
  | 'Chỉ số';

export enum TYPE_SENSOR {
  undefine = 0,
  LC_Meter = 1,
  Resolution_5L = 2,
  Resolution_0p25L = 3,
  Resolution_0p5L = 4,
  Resolution_1L = 5,
}

export const getTypeMeter = (value: number): string => {
  switch (value) {
    case TYPE_SENSOR.LC_Meter:
      return 'LC_METER';
    case TYPE_SENSOR.Resolution_0p25L:
      return 'Resolution_0p25L';
    case TYPE_SENSOR.Resolution_5L:
      return 'Resolution_5L';
    case TYPE_SENSOR.Resolution_0p5L:
      return 'Resolution_0p5L';
    case TYPE_SENSOR.Resolution_1L:
      return 'Resolution_1L';
    default:
      return 'undefined';
  }
};

export const TYPE_Q3 = {
  undefine: 0,
  _1p5_m3_h: 1.5,
  _2p5_m3_h: 2.5,
};
