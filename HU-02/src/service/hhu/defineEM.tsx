import { PropsExtraLabelPower, PropsLabelMaxDemand } from './aps/hhuAps';

export const LoaiDoc = {
  haveNotWrite: {
    value: 0,
    label: 'Chưa ghi',
  },
  byRF: {
    value: 1,
    label: 'RF',
  },
  byHand: {
    value: 2,
    label: 'Nhập tay',
  },
  byRFButFaild: {
    value: 3,
    label: 'RF thất bại',
  },
  byRFbutAbnormal: {
    value: 4,
    label: 'RF, chỉ số bắt thường',
  },
};

export enum CommandRF {
  INSTANT_POWER = 0x01,
  UI_PF = 0x02,
  POWER_0H = 0x03,
  PMAX_NEAREST = 0x04,
  TU_TI = 0x05,

  READ_TIME = 0x11,
  SYNC_TIME = 0x12,
  SEARCH_METER = 0x13,
  INIT_RF_MODULE = 0x14,
  RESET_RF_MODULE = 0x15,
  READ_VERSION = 0x16,
  READ_CE18_BY_REPEATER = 0x17,
}

export type PropsDropdown = {
  label: string;
  value: number;
};

export type TYPE_METER = 'Đồng hồ' | 'Repeater' | null;

export type PropsCheckBox = {
  label: string;
  value: number | string;
  checked?: boolean;
};

type PropsMeter = {
  title: string;
  id: string;
  value: number;
  allowTypeRead: PropsCheckBox[];
};

type PropsLabelMeter =
  | 'CE-18G'
  | 'CE-18'
  | 'CE-14'
  | 'ME-40'
  | 'ME-41'
  | 'ME-42'
  | 'Elster'
  | 'Repeater';

export type PropsMeterSpecies = {
  'CE-18G': PropsMeter;
  'CE-18': PropsMeter;
  'CE-14': PropsMeter;
  'ME-40': PropsMeter;
  'ME-41': PropsMeter;
  'ME-42': PropsMeter;
  Elster: PropsMeter;
  Repeater: PropsMeter;
};

export const meterSpecies: PropsMeterSpecies = {
  'CE-18G': {
    title: 'CE-18G',
    id: 'CE-18G',
    value: 0x01,
    allowTypeRead: [
      {
        label: 'UI cosφ',
        value: CommandRF.UI_PF,
      },
      {
        label: 'Điện năng',
        value: CommandRF.INSTANT_POWER,
      },
    ],
  },
  'CE-18': {
    title: 'CE-18',
    id: 'CE-18',
    value: 0x02,
    allowTypeRead: [
      {
        label: 'UI cosφ',
        value: CommandRF.UI_PF,
      },
      {
        label: 'Điện năng',
        value: CommandRF.INSTANT_POWER,
      },
      {
        label: 'TGian',
        value: CommandRF.READ_TIME,
      },
    ],
  },
  'CE-14': {
    title: 'CE-14',
    id: 'CE-14',
    value: 0x03,
    allowTypeRead: [
      {
        label: 'UI cosφ',
        value: CommandRF.UI_PF,
      },
      {
        label: 'Điện năng',
        value: CommandRF.INSTANT_POWER,
      },
      {
        label: 'Pmax',
        value: CommandRF.PMAX_NEAREST,
      },
      {
        label: 'TGian',
        value: CommandRF.READ_TIME,
      },
    ],
  },
  'ME-40': {
    title: 'ME-40',
    id: 'ME-40',
    value: 0x04,
    allowTypeRead: [
      {
        label: 'UI cosφ',
        value: CommandRF.UI_PF,
      },
      {
        label: 'Điện năng',
        value: CommandRF.INSTANT_POWER,
      },
      {
        label: 'TGian',
        value: CommandRF.READ_TIME,
      },
    ],
  },
  'ME-41': {
    title: 'ME-41',
    id: 'ME-41',
    value: 0x05,
    allowTypeRead: [
      {
        label: 'UI cosφ',
        value: CommandRF.UI_PF,
      },
      {
        label: 'Điện năng',
        value: CommandRF.INSTANT_POWER,
      },
      {
        label: 'Pmax',
        value: CommandRF.PMAX_NEAREST,
      },
      {
        label: 'TU & TI',
        value: CommandRF.TU_TI,
      },
      {
        label: 'TGian',
        value: CommandRF.READ_TIME,
      },
    ],
  },

  'ME-42': {
    title: 'ME-42',
    id: 'ME-42',
    value: 0x06,
    allowTypeRead: [
      {
        label: 'UI cosφ',
        value: CommandRF.UI_PF,
      },
      {
        label: 'Điện năng',
        value: CommandRF.INSTANT_POWER,
      },
      {
        label: 'Pmax',
        value: CommandRF.PMAX_NEAREST,
      },
      {
        label: 'TGian',
        value: CommandRF.READ_TIME,
      },
    ],
  },
  Repeater: {
    title: 'Repeater',
    id: 'Repeater',
    value: 0x07,
    allowTypeRead: [
      // {
      //   label: 'UI cosφ',
      //   value: CommandRF.UI_PF,
      // },
      {
        label: 'Điện năng',
        value: CommandRF.INSTANT_POWER,
      },
    ],
  },
  Elster: {
    // giong 42DLMS
    title: 'Elster',
    id: 'Elster',
    value: 0x08,
    allowTypeRead: [
      {
        label: 'UI cosφ',
        value: CommandRF.UI_PF,
      },
      {
        label: 'Điện năng',
        value: CommandRF.INSTANT_POWER,
      },
      {
        label: 'Pmax',
        value: CommandRF.PMAX_NEAREST,
      },
      {
        label: 'TGian',
        value: CommandRF.READ_TIME,
      },
    ],
  },
};

export const getMeterSpeciesDropDownProps = (): PropsDropdown[] => {
  const items: PropsDropdown[] = [];
  for (let i in meterSpecies) {
    const item: PropsDropdown = {
      label: meterSpecies[i].title,
      value: meterSpecies[i].id,
    };
    items.push(item);
  }
  return items;
};

export enum TYPE_READ_RF {
  HAVE_NOT_READ = '0',
  READ_SUCCEED = '1',
  WRITE_BY_HAND = '2',
  READ_FAILED = '3',
  ABNORMAL_CAPACITY = '4',
}

type PropsPowerDetail = {
  id: string;
  extraTitle: string | string[];
  value: number;
  titlePmax?: PropsLabelMaxDemand;
};

export const VALUE_TYPE_METER = {
  DLMS_16C: 0x01,
  DLMS_1C: 0x02,
  IEC: 0x03,
};

type PROPS_POWER_DEFINE = {
  '180': PropsPowerDetail;
  '181': PropsPowerDetail;
  '182': PropsPowerDetail;
  '183': PropsPowerDetail;
  '280': PropsPowerDetail;
  '281': PropsPowerDetail;
  '282': PropsPowerDetail;
  '283': PropsPowerDetail;
  '380': PropsPowerDetail;
  '480': PropsPowerDetail;
};

export const POWER_DEFINE: PROPS_POWER_DEFINE = {
  '180': {
    id: '180',
    value: 0,
    extraTitle: ['KT', 'SG'],
    titlePmax: '1601',
  },
  '181': {
    id: '181',
    value: 1,
    extraTitle: 'BT',
    titlePmax: '1611',
  },
  '182': {
    id: '182',
    value: 2,
    extraTitle: 'CD',
    titlePmax: '1621',
  },
  '183': {
    id: '183',
    value: 3,
    extraTitle: 'TD',
    titlePmax: '1631',
  },
  '280': {
    id: '280',
    value: 4,
    extraTitle: 'SN',
    titlePmax: '2601',
  },
  '281': {
    id: '281',
    value: 5,
    extraTitle: 'BN',
    titlePmax: '2611',
  },
  '282': {
    id: '282',
    value: 6,
    extraTitle: 'CN',
    titlePmax: '2621',
  },
  '283': {
    id: '283',
    value: 7,
    extraTitle: 'TN',
    titlePmax: '2631',
  },
  '380': {
    id: '380',
    value: 8,
    extraTitle: 'VC',
  },
  '480': {
    id: '480',
    value: 9,
    extraTitle: 'VN',
  },
};

// CE18G: 576,575,432,121,340,B26,D26,424,421
// CE18: 654,B10,B48,B11,B61,B29,B73,B74,B72
// CE14: 416,D23,M3B
// ME40: 655,D65,D66
// ME41: 304,F92
// ME42: 305,D73,F98,D70
// Elster: 790,636,772,773,577,632,755,770,771

export const getLabelAndIsManyPriceBy3Character = (
  character: string,
): {
  label: keyof PropsMeterSpecies;
  isManyPrice: boolean;
} => {
  const result: {
    label: keyof PropsMeterSpecies;
    isManyPrice: boolean;
  } = {
    label: 'x',
    isManyPrice: true,
  };

  switch (character) {
    case '576':
    case '575':
    case '432':
    case '121':
    case '340':
    case 'B26':
    case 'D26':
    case '424':
    case '421':
      result.label = 'CE-18G';
      result.isManyPrice = false;
      break;
    case '654':
    case 'B10':
    case 'B48':
    case 'B11':
    case 'B61':
    case 'B29':
    case 'B73':
    case 'B74':
    case 'B72':
      result.label = 'CE-18';
      result.isManyPrice = false;
      break;
    case '416':
    case 'D23':
    case 'M3B':
      result.label = 'CE-14';
      result.isManyPrice = true;
      break;
    case '655':
    case 'D65':
    case 'D66':
      result.label = 'ME-40';
      result.isManyPrice = false;
      break;
    case '304':
    case 'F92':
      result.label = 'ME-41';
      result.isManyPrice = true;
      break;
    case '305':
    case 'D73':
    case 'F98':
    case 'D70':
      result.label = 'ME-42';
      result.isManyPrice = true;
      break;
    case '790':
    case '636':
    case '772':
    case '773':
    case '577':
    case '632':
    case '755':
    case '770':
    case '771':
      result.label = 'Elster';
      result.isManyPrice = true;
      break;
  }

  // result.label = 'ME41';
  // result.isManyPrice = true;

  return result;
};

export const getRFCodeBySeriAndStockRFCode = (
  strSeri: string,
  stockRFcode: string,
): string => {
  let newRFcode: string = '';
  let headSeri = strSeri.substring(0, 2);
  //CE18
  if (
    headSeri === '17' &&
    (stockRFcode === '2' || stockRFcode === '18' || stockRFcode === '34')
  ) {
    newRFcode = '2';
  } else if (
    headSeri === '18-19' &&
    (stockRFcode === '2' || stockRFcode === '18' || stockRFcode === '34')
  ) {
    newRFcode = '18';
  } else if (
    headSeri === '20' &&
    (stockRFcode === '2' || stockRFcode === '18' || stockRFcode === '34')
  ) {
    newRFcode = '34';
  }

  //CE14
  if (
    headSeri === '17' &&
    (stockRFcode === '3' || stockRFcode === '19' || stockRFcode === '35')
  ) {
    newRFcode = '3';
  } else if (
    headSeri === '18-19' &&
    (stockRFcode === '3' || stockRFcode === '19' || stockRFcode === '35')
  ) {
    newRFcode = '19';
  } else if (
    headSeri === '20' &&
    (stockRFcode === '3' || stockRFcode === '19' || stockRFcode === '35')
  ) {
    newRFcode = '35';
  }

  //Me40
  if (
    headSeri === '17' &&
    (stockRFcode === '4' || stockRFcode === '20' || stockRFcode === '36')
  ) {
    newRFcode = '4';
  } else if (
    headSeri === '18-19' &&
    (stockRFcode === '4' || stockRFcode === '20' || stockRFcode === '36')
  ) {
    newRFcode = '20';
  } else if (
    headSeri === '20' &&
    (stockRFcode === '4' || stockRFcode === '20' || stockRFcode === '36')
  ) {
    newRFcode = '36';
  }

  //ME41
  if (
    headSeri === '17' &&
    (stockRFcode === '5' || stockRFcode === '21' || stockRFcode === '37')
  ) {
    newRFcode = '5';
  } else if (
    headSeri === '18-19' &&
    (stockRFcode === '5' || stockRFcode === '21' || stockRFcode === '37')
  ) {
    newRFcode = '21';
  } else if (
    headSeri === '20' &&
    (stockRFcode === '5' || stockRFcode === '21' || stockRFcode === '37')
  ) {
    newRFcode = '37';
  }

  //ME42
  if (
    headSeri === '17' &&
    (stockRFcode === '6' || stockRFcode === '22' || stockRFcode === '38')
  ) {
    newRFcode = '6';
  } else if (
    headSeri === '18-19' &&
    (stockRFcode === '6' || stockRFcode === '22' || stockRFcode === '38')
  ) {
    newRFcode = '22';
  } else if (
    headSeri === '20' &&
    (stockRFcode === '6' || stockRFcode === '22' || stockRFcode === '38')
  ) {
    newRFcode = '38';
  }

  return newRFcode;
};

export const getTypeAndIs1ChanelByRFCode = (
  rfCode: string,
): {
  type: TYPE_METER;
  is1Ch: boolean;
} => {
  let result: { type: TYPE_METER; is1Ch: boolean } = {
    type: null,
    is1Ch: false,
  };
  switch (rfCode) {
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
      result.type = 'DLMS';
      result.is1Ch = false;
      break;
    case '18':
    case '19':
    case '20':
    case '21':
    case '22':
      result.type = 'DLMS';
      result.is1Ch = true;
      break;
    case '34':
    case '35':
    case '36':
    case '37':
    case '38':
      result.type = 'IEC';
      result.is1Ch = true;
      break;
  }
  return result;
};

export const getRFCodeByRangeSeriAndCodeMeter = (
  strSeri: string,
  codeMeter: string,
): string => {
  const seri = Number(strSeri);
  let strRFCode = '';

  if (
    (seri >= 11000000 && seri <= 17034900) ||
    (seri >= 20747915 && seri <= 20750914) ||
    (seri >= 20471997 && seri <= 20473996) ||
    (seri >= 20468997 && seri <= 20471996)
  ) {
    strRFCode = '1';
  } else if (
    (seri >= 18002501 && seri <= 18062500) ||
    (seri >= 17076801 && seri <= 17156800) ||
    (seri >= 17034901 && seri <= 17035280) ||
    (seri >= 17172801 && seri <= 17303884) ||
    (seri >= 18063501 && seri <= 18083183) ||
    (seri >= 18083185 && seri <= 18089750) ||
    (seri >= 18063301 && seri <= 18063404)
  ) {
    strRFCode = '2';
  } else if (
    (seri >= 17306001 && seri <= 17306894) ||
    (seri >= 18144601 && seri <= 18144735) ||
    (seri >= 18000501 && seri <= 18001600)
  ) {
    strRFCode = '3';
  } else if (
    (seri >= 17165701 && seri <= 17172278) ||
    (seri >= 18144801 && seri <= 18145132)
  ) {
    strRFCode = '4';
  } else if (
    (seri >= 18091801 && seri <= 18141800) ||
    (seri >= 18203601 && seri <= 18233100) ||
    (seri >= 18141801 && seri <= 18141832) ||
    (seri >= 18270001 && seri <= 18320000) ||
    (seri >= 18322201 && seri <= 18332200) ||
    (seri >= 19000501 && seri <= 19040500) ||
    (seri >= 19052201 && seri <= 19073700) ||
    (seri >= 19073701 && seri <= 19186200) ||
    (seri >= 19186202 && seri <= 19186301) ||
    (seri >= 19193700 && seri <= 19194199) ||
    (seri >= 19195001 && seri <= 19195600) ||
    (seri >= 19274381 && seri <= 19396220) ||
    (seri >= 19606313 && seri <= 19606357) ||
    (seri >= 19195601 && seri <= 19250600) ||
    (seri >= 19403283 && seri <= 19463282) ||
    (seri >= 19466489 && seri <= 19467488) ||
    (seri >= 19467520 && seri <= 19527519) ||
    (seri >= 19945340 && seri <= 19946269) ||
    (seri >= 19951278 && seri <= 19953277) ||
    (seri >= 20000001 && seri <= 20060000) ||
    (seri >= 20742915 && seri <= 20747914) ||
    (seri >= 20698231 && seri <= 20701230) ||
    (seri >= 20656101 && seri <= 20658100) ||
    (seri >= 20484198 && seri <= 20484397) ||
    (seri >= 20478928 && seri <= 20482497) ||
    (seri >= 20395116 && seri <= 20395125) ||
    (seri >= 20395126 && seri <= 20395215) ||
    (seri >= 20395114 && seri <= 20395114) ||
    (seri >= 20395423 && seri <= 20396022) ||
    (seri >= 20390283 && seri <= 20392282)
  ) {
    strRFCode = '18';
  } else if (
    (seri >= 18256801 && seri <= 18257300) ||
    (seri >= 18234001 && seri <= 18235500) ||
    (seri >= 18256301 && seri <= 18256500) ||
    (seri >= 19044103 && seri <= 19044103) ||
    (seri >= 19192500 && seri <= 19193695) ||
    (seri >= 20792227 && seri <= 20792526) ||
    (seri >= 20698016 && seri <= 20698215) ||
    (seri >= 20473998 && seri <= 20474497) ||
    (seri >= 20434763 && seri <= 20434861) ||
    (seri >= 20468996 && seri <= 20468996) ||
    (seri >= 20395216 && seri <= 20395216) ||
    (seri >= 20395115 && seri <= 20395115) ||
    (seri >= 20396023 && seri <= 20396055)
  ) {
    strRFCode = '19';
  } else if (
    (seri >= 18242001 && seri <= 18252000) ||
    (seri >= 18258401 && seri <= 18262824) ||
    (seri >= 18262901 && seri <= 18263526) ||
    (seri >= 19192400 && seri <= 19192499) ||
    (seri >= 19194901 && seri <= 19195000) ||
    (seri >= 19250601 && seri <= 19252600) ||
    (seri >= 19258679 && seri <= 19272678) ||
    (seri >= 20741915 && seri <= 20742414) ||
    (seri >= 20697362 && seri <= 20697515) ||
    (seri >= 20790927 && seri <= 20791726) ||
    (seri >= 20395413 && seri <= 20395422) ||
    (seri >= 20832530 && seri <= 20832562) ||
    (seri >= 20698216 && seri <= 20698230) ||
    (seri >= 20482498 && seri <= 20482953) ||
    (seri >= 20395217 && seri <= 20395221) ||
    (seri >= 20395113 && seri <= 20395113) ||
    (seri >= 20395223 && seri <= 20395422) ||
    (seri >= 20389583 && seri <= 20389782) ||
    (seri >= 20381221 && seri <= 20381720) ||
    (seri >= 20330073 && seri <= 20330320)
  ) {
    strRFCode = '20';
  } else if (
    (seri >= 10000020 && seri <= 10000030) ||
    (seri >= 18336001 && seri <= 18338700) ||
    (seri >= 19194701 && seri <= 19194900) ||
    (seri >= 19463283 && seri <= 19463787) ||
    (seri >= 20132492 && seri <= 20136491) ||
    (seri >= 20791727 && seri <= 20792226) ||
    (seri >= 20697516 && seri <= 20698015) ||
    (seri >= 20406489 && seri <= 20406490) ||
    (seri >= 20406542 && seri <= 20406555) ||
    (seri >= 20624836 && seri <= 20624874) ||
    (seri >= 20482998 && seri <= 20483497) ||
    (seri >= 20406056 && seri <= 20406555) ||
    (seri >= 20389783 && seri <= 20390282)
  ) {
    strRFCode = '21';
  } else if (
    (seri >= 20742415 && seri <= 20742914) ||
    (seri >= 20483565 && seri <= 20483997) ||
    (seri >= 20395222 && seri <= 20395222) ||
    (seri >= 20394913 && seri <= 20395112)
  ) {
    strRFCode = '22';
  } else if (seri >= 20068492 && seri <= 20082491) {
    strRFCode = '36';
  } else if (seri >= 20136492 && seri <= 20138791) {
    strRFCode = '38';
  } else {
    let firstLeter = codeMeter.substring(0, 3);
    let labelAndManyPrice = getLabelAndIsManyPriceBy3Character(firstLeter);
    switch (labelAndManyPrice.label) {
      case 'CE-14':
        strRFCode = '35';
        break;
      case 'CE-18':
        strRFCode = '34';
        break;
      case 'ME-40':
        strRFCode = '36';
        break;
      case 'ME-41':
        strRFCode = '37';
        break;
      case 'ME-42':
        strRFCode = '38';
        break;
    }
  }

  return strRFCode;
};
