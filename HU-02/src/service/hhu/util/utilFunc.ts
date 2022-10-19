import {PropsLabel} from '../defineWM';
import {
  FieldOpticalResponseProps,
  OpticalDailyProps,
} from '../Optical/opticalFunc';
import {Rtc_SimpleTimeProps} from '../RF/radioProtocol';

export const getUnitByLabel = (label: PropsLabel) => {
  let unit = '';

  switch (label) {
    case 'Xuôi':
    case 'Ngược':
      unit = ' (lít)';
      break;

    case 'Nhiệt độ':
      unit = ' (°C)';
      break;
    case 'Điện áp':
      unit = ' (V)';
      break;
    case 'Rssi':
      unit = ' (dbm)';
      break;
  }
  return unit;
};

export type PropsLabelOptical =
  | FieldOpticalResponseProps
  | keyof OpticalDailyProps;

// 'Thời điểm chốt': string;
//   'Dữ liệu xuôi': string;
//   'Dữ liệu ngược': string;

export const getUnitByLabelOptical = (label: PropsLabelOptical) => {
  let unit = '';

  switch (label) {
    case 'Dữ liệu':
    case 'Dữ liệu xuôi':
    case 'Dữ liệu ngược':
      unit = ' (lít)';
      break;
    case 'Điện áp':
      unit = ' (V)';
      break;
  }
  return unit;
};

export function SimpleTimeToSTring(simpleTime: Rtc_SimpleTimeProps) {
  const stringRtc =
    simpleTime.u8Hour.toString().padStart(2, '0') +
    ':' +
    simpleTime.u8Minute.toString().padStart(2, '0') +
    ':' +
    simpleTime.u8Second.toString().padStart(2, '0') +
    ' ' +
    simpleTime.u8Date.toString().padStart(2, '0') +
    '/' +
    simpleTime.u8Month.toString().padStart(2, '0') +
    '/' +
    (simpleTime.u8Year + 2000).toString();
  return stringRtc;
}
