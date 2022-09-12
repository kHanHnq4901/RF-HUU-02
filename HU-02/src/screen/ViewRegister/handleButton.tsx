import { PropsKHCMISModel } from '../../database/model';
import {
  getLabelAndIsManyPriceBy3Character,
  TYPE_READ_RF,
} from '../../service/hhu/defineEM';
import {
  addMoreItemToRender,
  hookProps,
  navigation,
  PropsDatatable,
  PropsTable,
} from './controller';

type PropsFilter = {
  station: string;
  isReadSucceed: boolean;
  isNoRead: boolean;
  isReadFailed: boolean;
  isWriteHand: boolean;
  isAbnormal: boolean;
  searchText?: string;
};

const funcFilter = (
  dataDB: PropsKHCMISModel[],
  filter: PropsFilter,
): { dataTable: PropsTable; totalBCS: number; totalSucceed: number } => {
  let totalBCS = 0;
  let totalSucceed = 0;
  let dataTb: PropsTable = {
    render: [],
    noRender: [],
  };

  console.log('filter:', filter);
  for (let item of dataDB) {
    if (item.MA_TRAM !== filter.station) {
      continue;
    }

    const labelAndIsManyPrice = getLabelAndIsManyPriceBy3Character(
      item.MA_CTO.substring(0, 3),
    );
    dataTb.noRender.push({
      checked: false,
      data: item,
      id: item.id,
      show: true,
      stt: item.TT.toString(),
      isManyPrice: labelAndIsManyPrice.isManyPrice,
      labelMeter: labelAndIsManyPrice.label,
    });
  }
  //console.log('dataTb:', dataTb.length);
  dataTb.noRender = dataTb.noRender.map(itm => {
    //console.log('a');
    if (
      filter.isReadSucceed ||
      filter.isNoRead ||
      filter.isReadFailed ||
      filter.isWriteHand ||
      filter.isAbnormal
    ) {
      //console.log('a');
      itm.show = false;
      for (let i = 0; i < 1; i++) {
        if (filter.isReadSucceed) {
          if (itm.data.LoaiDoc === TYPE_READ_RF.READ_SUCCEED) {
            itm.show = true;
            break;
          }
        }
        if (filter.isNoRead) {
          if (itm.data.LoaiDoc === TYPE_READ_RF.HAVE_NOT_READ) {
            itm.show = true;
            break;
          }
        }
        if (filter.isAbnormal) {
          if (itm.data.LoaiDoc === TYPE_READ_RF.ABNORMAL_CAPACITY) {
            itm.show = true;
            break;
          }
        }
        if (filter.isReadFailed) {
          if (itm.data.LoaiDoc === TYPE_READ_RF.READ_FAILED) {
            itm.show = true;
            break;
          }
        }
        if (filter.isWriteHand) {
          if (itm.data.LoaiDoc === TYPE_READ_RF.WRITE_BY_HAND) {
            itm.show = true;
            break;
          }
        }
      }
    } else {
      itm.show = true;
      //console.log('b');
    }

    //console.log('k:', itm.show);

    if (filter.searchText) {
      //console.log('k:', filter.column);
      let searchText = filter.searchText.toLowerCase();
      if (itm.show === true) {
        itm.show = false;
        for (let i = 0; i < 1; i++) {
          if (itm.labelMeter.toLowerCase().includes(searchText)) {
            itm.show = true;
            break;
          }
          if (itm.data.SERY_CTO.toLowerCase().includes(searchText)) {
            itm.show = true;
            break;
          }
          if (itm.data.LOAI_BCS.toLowerCase().includes(searchText)) {
            itm.show = true;
            break;
          }
          if (itm.data.MA_QUYEN.toLowerCase().includes(searchText)) {
            itm.show = true;
            break;
          }
          if (itm.data.MA_COT.toLowerCase().includes(searchText)) {
            itm.show = true;
            break;
          }
          if (itm.data.TEN_KHANG.toLowerCase().includes(searchText)) {
            itm.show = true;
            break;
          }
          if (itm.data.MA_KHANG.toLowerCase().includes(searchText)) {
            itm.show = true;
            break;
          }
          if (itm.data.DIA_CHI.toLowerCase().includes(searchText)) {
            itm.show = true;
            break;
          }
        }
      }
    }
    //console.log('itm.show:', itm.show);
    if (itm.show === true) {
      totalBCS++;
      if (
        itm.data.LoaiDoc === TYPE_READ_RF.READ_SUCCEED ||
        itm.data.LoaiDoc === TYPE_READ_RF.WRITE_BY_HAND
      ) {
        totalSucceed++;
      }
    }
    itm.data = { ...itm.data };
    return { ...itm };
  });

  dataTb.render = [];

  dataTb = addMoreItemToRender(dataTb);

  return {
    dataTable: dataTb,
    totalBCS: totalBCS,
    totalSucceed: totalSucceed,
  };
};

export const onChangeTextSearch = (searchText: string) => {
  if (!hookProps.state.selectedStation) {
    return;
  }
  hookProps.setState(state => {
    let isReadSucceed = state.arrCheckBoxRead.find(
      itm => itm.label === 'Thành công',
    )?.checked;
    let isNoRead = state.arrCheckBoxRead.find(
      itm => itm.label === 'Chưa đọc',
    )?.checked;
    let isReadFailed = state.arrCheckBoxRead.find(
      itm => itm.label === 'Đọc lỗi',
    )?.checked;
    let isAbnormal = state.arrCheckBoxRead.find(
      itm => itm.label === 'Bất thường',
    )?.checked;
    let isWriteHand = state.arrCheckBoxRead.find(
      itm => itm.label === 'Ghi tay',
    )?.checked;

    const result = funcFilter(state.dataDB, {
      station: state.selectedStation as string,
      isReadSucceed: isReadSucceed as boolean,
      isNoRead: isNoRead as boolean,
      isAbnormal: isAbnormal as boolean,
      isReadFailed: isReadFailed as boolean,
      isWriteHand: isWriteHand as boolean,
      searchText: searchText,
    });
    state.dataTable = result.dataTable;
    state.totalBCS = result.totalBCS.toString();
    state.totalSucceed = result.totalSucceed.toString();
    return { ...state };
  });
};

export const onStationSelected = (sation: string) => {
  hookProps.setState(state => {
    state.status = 'Đang cập nhật dữ liệu';
    return { ...state };
  });

  let isReadSucceed = hookProps.state.arrCheckBoxRead.find(
    itm => itm.label === 'Thành công',
  )?.checked;
  let isNoRead = hookProps.state.arrCheckBoxRead.find(
    itm => itm.label === 'Chưa đọc',
  )?.checked;
  let isReadFailed = hookProps.state.arrCheckBoxRead.find(
    itm => itm.label === 'Đọc lỗi',
  )?.checked;
  let isAbnormal = hookProps.state.arrCheckBoxRead.find(
    itm => itm.label === 'Bất thường',
  )?.checked;
  let isWriteHand = hookProps.state.arrCheckBoxRead.find(
    itm => itm.label === 'Ghi tay',
  )?.checked;
  //console.log('k');
  const result = funcFilter(hookProps.state.dataDB, {
    station: sation as string,
    isReadSucceed: isReadSucceed as boolean,
    isNoRead: isNoRead as boolean,
    isAbnormal: isAbnormal as boolean,
    isReadFailed: isReadFailed as boolean,
    isWriteHand: isWriteHand as boolean,
  });
  hookProps.setState(state => {
    state.status = '';
    state.selectedStation = sation;
    state.dataTable = result.dataTable;
    state.totalBCS = result.totalBCS.toString();
    state.totalSucceed = result.totalSucceed.toString();
    return { ...state };
  });
};

export const onCheckBoxTypeReadChange = (label: string) => {
  hookProps.setState(state => {
    state.arrCheckBoxRead = state.arrCheckBoxRead.map(cb => {
      if (cb.label === label) {
        cb.checked = !cb.checked;
      }
      return { ...cb };
    });

    let isReadSucceed = hookProps.state.arrCheckBoxRead.find(
      itm => itm.label === 'Thành công',
    )?.checked;
    let isNoRead = hookProps.state.arrCheckBoxRead.find(
      itm => itm.label === 'Chưa đọc',
    )?.checked;
    let isReadFailed = hookProps.state.arrCheckBoxRead.find(
      itm => itm.label === 'Đọc lỗi',
    )?.checked;
    let isAbnormal = hookProps.state.arrCheckBoxRead.find(
      itm => itm.label === 'Bất thường',
    )?.checked;
    let isWriteHand = hookProps.state.arrCheckBoxRead.find(
      itm => itm.label === 'Ghi tay',
    )?.checked;
    const result = funcFilter(hookProps.state.dataDB, {
      station: hookProps.state.selectedStation as string,
      isReadSucceed: isReadSucceed as boolean,
      isNoRead: isNoRead as boolean,
      isAbnormal: isAbnormal as boolean,
      isReadFailed: isReadFailed as boolean,
      isWriteHand: isWriteHand as boolean,
    });

    state.dataTable = result.dataTable;
    state.totalBCS = result.totalBCS.toString();
    state.totalSucceed = result.totalSucceed.toString();
    return { ...state };
  });
};

export type PropsPencil = {
  data: PropsDatatable;
};

export const onPencilPress = (props: PropsPencil) => {
  //console.log('navigation:', props.navigation);
  navigation.navigate('ViewRegisterDetailed', {
    data: props.data,
  });
};
