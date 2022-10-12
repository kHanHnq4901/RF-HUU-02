import { findNodeHandle, Vibration } from 'react-native';
import { dataDBTabel } from '../../database/model';
import { PropsCondition } from '../../database/repository';
import { CMISKHServices } from '../../database/service';
import {
  PropsExtraLabelPower,
  PropsLabelPower,
  PropsResponse,
} from '../../service/hhu/aps/hhuAps';
import { apsReadRfGCS } from '../../service/hhu/aps/hhuApsGCS';
import { formatDateTimeDB } from '../../service/hhu/aps/util';
import {
  getRFCodeBySeriAndStockRFCode,
  POWER_DEFINE,
  TYPE_READ_RF,
} from '../../service/hhu/defineEM';
import { sleep } from '../../util/util';
import { refScroll } from './controller';
import {
  addMoreItemToRender,
  hookProps,
  navigation,
  PropsDatatable,
  PropsTable,
  store,
  variable,
} from './controller';

const TAG = 'WriteByBookCode';

export function onItemPress(item: PropsDatatable) {
  hookProps.setState(state => {
    for (let key in state.dataTable) {
      state.dataTable[key] = state.dataTable[key].map(itm => {
        if (itm.data.SERY_CTO === item.data.SERY_CTO) {
          if (
            item.data.LoaiDoc === TYPE_READ_RF.READ_SUCCEED ||
            item.data.LoaiDoc === TYPE_READ_RF.WRITE_BY_HAND
          ) {
            itm.checked = false;
          } else {
            itm.checked = !itm.checked;
          }
        }
        return { ...itm };
      });
    }
    return { ...state };
  });
}

type PropsFilter = {
  column: string;
  isNoRead: boolean;
  isReadFailed: boolean;
  isWriteHand: boolean;
  isAbnormal: boolean;
  searchText?: string;
};

const setStatus = (value: string) => {
  hookProps.setState(state => {
    state.status = value;
    return { ...state };
  });
};

const funcFilter = (
  dataTable: PropsTable,
  filter: PropsFilter,
): { dataTable: PropsTable; totalBCS: number; totalSucceed: number } => {
  //console.log('filter:', filter);
  let totalBCS = 0;
  let totalSucceed = 0;
  let totalData: PropsDatatable[] = [];
  //console.log('dataTable.render:', dataTable.render.length);
  for (let row of dataTable.render) {
    totalData.push(row);
  }
  //console.log('dataTable.noRender:', dataTable.noRender.length);
  for (let row of dataTable.noRender) {
    totalData.push(row);
  }
  console.log('length total Data:', totalData.length);
  totalData = totalData.map(itm => {
    if (filter.column === 'Tất cả' || filter.column === null) {
      itm.show = true;
      //console.log('a');
    } else {
      if (itm.data.MA_COT === filter.column) {
        itm.show = true;
      } else {
        itm.show = false;
      }
    }
    if (itm.show) {
      if (
        filter.isNoRead ||
        filter.isReadFailed ||
        filter.isWriteHand ||
        filter.isAbnormal
      ) {
        itm.show = false;
        for (let i = 0; i < 1; i++) {
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
      }
    }

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

  dataTable.render = [];
  dataTable.noRender = totalData;

  dataTable = addMoreItemToRender(dataTable);

  return {
    dataTable: dataTable,
    totalBCS: totalBCS,
    totalSucceed: totalSucceed,
  };
};

export function onStopReadPress() {
  hookProps.setState(state => {
    state.requestStop = true;
    return { ...state };
  });
}

export function onSelectedItemDropdown(column: string) {
  if (hookProps.state.selectedColumn === column) {
    return;
  }
  hookProps.setState(state => {
    state.selectedColumn = column;
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
    const result = funcFilter(state.dataTable, {
      column: state.selectedColumn,
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
}

export function onCheckBoxTypeReadChange(label: string) {
  hookProps.setState(state => {
    state.arrCheckBoxRead = state.arrCheckBoxRead.map(cb => {
      if (cb.label === label) {
        cb.checked = !cb.checked;
      }
      return { ...cb };
    });

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
    const result = funcFilter(state.dataTable, {
      column: state.selectedColumn as string,
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
}

export function onSelectAllPress() {
  hookProps.setState(state => {
    state.selectAll = !state.selectAll;
    for (let key in state.dataTable) {
      state.dataTable[key] = state.dataTable[key].map(item => {
        // const a = item as PropsDatatable;
        // if (a.stt === '1') {
        //   console.log('item.data.LoaiDoc:', item.data.LoaiDoc);
        // }
        if (
          item.data.LoaiDoc === TYPE_READ_RF.READ_SUCCEED ||
          item.data.LoaiDoc === TYPE_READ_RF.ABNORMAL_CAPACITY ||
          item.data.LoaiDoc === TYPE_READ_RF.WRITE_BY_HAND
        ) {
          item.checked = false;
        } else {
          item.checked = state.selectAll;
        }
        return { ...item };
      });
    }

    return { ...state };
  });
}

export function onChangeTextSearch(searchText: string) {
  hookProps.setState(state => {
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
    const result = funcFilter(state.dataTable, {
      column: state.selectedColumn as string,
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
}

type PropsPencil = {
  data: PropsDatatable;
};

export function onPencilPress(props: PropsPencil) {
  //console.log('navigation:', props.navigation);
  navigation.navigate('WriteByHand', {
    data: props.data,
  });
}

const checkCondition = (): boolean => {
  let hasItem = false;

  for (let item of hookProps.state.dataTable.render) {
    if (item.checked === true && item.show) {
      hasItem = true;
      break;
    }
  }
  if (hasItem === true) {
    return true;
  } else {
    return false;
  }
};

type PropsDataInsertDb = {
  power: string;
  datePower?: string;
  pmax?: string;
  datePmax?: string;
};

type PropsInsertDB = {
  [K in PropsExtraLabelPower]: PropsDataInsertDb;
};

const _getDataToDbByTitle = (
  valueInsertDb: PropsInsertDB,
  apsResponse: PropsResponse,
  objPower: { [K in PropsLabelPower]?: string | undefined },
  labelPower: PropsLabelPower,
  titleExtraPower: PropsExtraLabelPower,
) => {
  const labelPmax = POWER_DEFINE[labelPower].titlePmax;
  let valuePmax: string | undefined;
  let datePmax: string | undefined;
  if (labelPmax) {
    const objPmax = apsResponse.obj.MaxDemand?.find(item => {
      for (let name in item) {
        if (name === labelPmax) {
          return true;
        }
      }
      return false;
    });
    if (objPmax) {
      valuePmax = objPmax[labelPmax];
      datePmax = objPmax['Thời điểm'];
    } else {
      valuePmax = undefined;
      datePmax = undefined;
    }
  }

  const data = {
    power: objPower[labelPower],
    datePower: apsResponse.obj['Ngày chốt'],
  } as PropsDataInsertDb;
  if (apsResponse.obj['Ngày chốt']) {
    data.datePower = apsResponse.obj['Ngày chốt'];
  }
  if (valuePmax) {
    data.pmax = valuePmax;
    data.datePmax = datePmax;
  }
  valueInsertDb[titleExtraPower] = data;
};

export const convertApsResponse2PropsInsertDb = (
  apsResponse: PropsResponse,
): PropsInsertDB => {
  let valueInsertDb = {} as PropsInsertDB;

  for (let power of apsResponse.obj.Power ?? []) {
    for (let label in power) {
      const extraTitle = POWER_DEFINE[label].extraTitle;
      if (typeof extraTitle === 'object') {
        if (Array.isArray(extraTitle) === true) {
          for (let _title of extraTitle) {
            _getDataToDbByTitle(
              valueInsertDb,
              apsResponse,
              power,
              label as PropsLabelPower,
              _title,
            );
          }
        }
      } else {
        _getDataToDbByTitle(
          valueInsertDb,
          apsResponse,
          power,
          label as PropsLabelPower,
          extraTitle,
        );
      }
    }
  }

  return valueInsertDb;
};

const readData = async () => {
  let numRetries = Number(store.state.appSetting.numRetriesRead);

  if (numRetries <= 0) {
    numRetries = 1;
  }

  console.log('numRetries:', numRetries);

  for (
    let index = 0;
    index < hookProps.state.dataTable.render.length;
    index++
  ) {
    const item = hookProps.state.dataTable.render[index];
    if (item.checked === true && item.show === true) {
      if (hookProps.state.requestStop === true) {
        break;
      } else {
        await sleep(150);
      }
      try {
        for (let j = 0; j < 1; j++) {
          let strSeri: string = item.data.SERY_CTO;
          let codeMeterInDb = item.data.MA_CTO;
          let strRFCode: string = item.data.RF;
          let optinalRFCode = getRFCodeBySeriAndStockRFCode(strSeri, strRFCode);
          // let iDate: Date = hookProps.state.is0h
          //   ? hookProps.state.dateLatch
          //   : new Date();
          let iDate: Date = new Date();
          console.log('strSeri:', strSeri);
          setStatus('Đang đọc ' + strSeri + ' ...');
          let result = await apsReadRfGCS({
            seri: strSeri,
            codeMeterInDB: codeMeterInDb,
            is0h: false,
            dateLatch: iDate,
            rfCode: strRFCode,
            numRetries: numRetries,
            setStatus: setStatus,
          });
          console.log(TAG, 'result:', JSON.stringify(result));
          if (result.bSucceed === false) {
            if (store.state.hhu.connect !== 'CONNECTED') {
              return;
            }
            if (optinalRFCode !== strRFCode && optinalRFCode !== '') {
              console.log('try with new RF code: ', optinalRFCode);
              console.log('stock RF code: ', strRFCode);
              strRFCode = optinalRFCode;
              result = await apsReadRfGCS({
                seri: strSeri,
                codeMeterInDB: codeMeterInDb,
                is0h: false,
                dateLatch: iDate,
                rfCode: strRFCode,
                numRetries: numRetries,
                setStatus: setStatus,
              });
            }
          }

          if (result.bSucceed === true) {
            const dataConverted = convertApsResponse2PropsInsertDb(result);

            // find all element arr of this seri
            const listUpdate: PropsUpdateDb[] = [];
            let totalUpdateFailed: number = 0;

            // only get curent dât, no need updae hook
            hookProps.setState(state => {
              for (let key in state.dataTable) {
                state.dataTable[key] = state.dataTable[key].map(itm => {
                  if (itm.data.SERY_CTO === strSeri) {
                    // get BCS, rfcode
                    const strBCS = itm.data.LOAI_BCS as string;
                    const RfcodeNow = itm.data.RF as string;
                    if (dataConverted[strBCS]) {
                      const newCapacity =
                        Number(dataConverted[strBCS].power) -
                        Number(itm.data.CS_CU);
                      listUpdate.push({
                        seri: strSeri,
                        BCSCMIS: strBCS,
                        date: dataConverted[strBCS].datePower ?? iDate,
                        RfCode: RfcodeNow,
                        T0: dataConverted[strBCS].power,
                        newCapacity: newCapacity,
                        oldCapacity: Number(itm.data.SL_CU),
                        Pmax: dataConverted[strBCS].pmax,
                        datePmax: dataConverted[strBCS].datePmax,
                      });
                    }
                  }
                  return itm;
                });
              }

              return state;
            });

            let bcsReadSucced = '';
            let statusWriteFailed = '';
            for (let itemUpdate of listUpdate) {
              bcsReadSucced += ' ' + itemUpdate.BCSCMIS + ',';
              let updateDbSucceess = await updateDataToDB(itemUpdate);
              if (updateDbSucceess) {
                itemUpdate.updateSucced = true;
              } else {
                totalUpdateFailed++;
                itemUpdate.updateSucced = false;
                statusWriteFailed += ' ' + itemUpdate.BCSCMIS + ',';
              }
            }

            let status =
              'Đọc thành công ' +
              listUpdate.length +
              ' chỉ mục: ' +
              bcsReadSucced +
              ' của seri: ' +
              strSeri;

            if (totalUpdateFailed > 0) {
              status +=
                ' Ghi Lỗi ' +
                totalUpdateFailed +
                ':' +
                statusWriteFailed +
                ' của seri: ' +
                strSeri;
            }
            // let node = null;
            hookProps.setState(state => {
              state.status = status;
              for (let key in state.dataTable) {
                for (let itemUpdate of listUpdate) {
                  const indexCurRow = state.dataTable[key].findIndex(
                    itm =>
                      itm.data.SERY_CTO === strSeri &&
                      itm.data.LOAI_BCS === itemUpdate.BCSCMIS &&
                      itm.data.RF === itemUpdate.RfCode,
                  );
                  //console.log('indexrow:', indexCurRow);
                  if (indexCurRow !== -1) {
                    state.dataTable[key][indexCurRow] = {
                      ...state.dataTable[key][indexCurRow],
                    };
                    state.dataTable[key][indexCurRow].data = {
                      ...state.dataTable[key][indexCurRow].data,
                    };
                    state.dataTable[key][indexCurRow].checked = false;
                    if (itemUpdate.isAbnormal !== true) {
                      state.dataTable[key][indexCurRow].data.LoaiDoc =
                        TYPE_READ_RF.READ_SUCCEED;
                    } else {
                      state.dataTable[key][indexCurRow].data.LoaiDoc =
                        TYPE_READ_RF.ABNORMAL_CAPACITY;
                    }
                    if (
                      itemUpdate.isAbnormal !== true ||
                      (itemUpdate.isAbnormal &&
                        itemUpdate.stillSaveWhenAbnormal)
                    ) {
                      state.dataTable[key][indexCurRow].data.CS_MOI = Number(
                        itemUpdate.T0,
                      );
                      state.dataTable[key][indexCurRow].data.NGAY_MOI =
                        formatDateTimeDB(itemUpdate.date);
                      if (itemUpdate.Pmax) {
                        state.dataTable[key][indexCurRow].data.PMAX = Number(
                          itemUpdate.Pmax,
                        );
                      }
                      if (itemUpdate.datePmax) {
                        state.dataTable[key][indexCurRow].data.NGAY_PMAX =
                          itemUpdate.datePmax;
                      }
                      if (itemUpdate.ghiChu) {
                        state.dataTable[key][indexCurRow].data.GhiChu =
                          itemUpdate.ghiChu;
                      }
                    }
                    // node = state.dataTable[key][indexCurRow];
                  }
                }
              }
              let totalSucceed = 0;
              for (let key in state.dataTable) {
                for (let itm of state.dataTable[key]) {
                  if (
                    itm.data.LoaiDoc === TYPE_READ_RF.READ_SUCCEED ||
                    itm.data.LoaiDoc === TYPE_READ_RF.WRITE_BY_HAND ||
                    (itm.data.LoaiDoc === TYPE_READ_RF.ABNORMAL_CAPACITY &&
                      Number(itm.data.CS_MOI) !== 0)
                  ) {
                    totalSucceed++;
                  }
                }
              }
              state.totalSucceed = totalSucceed.toString();

              return { ...state };
            });

            // if (node) {
            //   refScroll.current?.scrollResponderScrollTo({
            //     x: 0,
            //     y: findNodeHandle(node),
            //     animated: true,
            //   });
            // }

            //}
            index = -1; // reset index -1 ++ = 0
            break;
          } else {
            if (store.state.hhu.connect !== 'CONNECTED') {
              return;
            }
            hookProps.setState(state => {
              state.status =
                'Đọc thất bại seri ' + strSeri + ': ' + result.strMessage;
              for (let key in state.dataTable) {
                state.dataTable[key] = state.dataTable[key].map(itm => {
                  if (itm.data.SERY_CTO === strSeri) {
                    itm = { ...itm };
                    itm.data = { ...itm.data };
                    itm.checked = false;
                    itm.data.LoaiDoc =
                      itm.data.LoaiDoc === TYPE_READ_RF.HAVE_NOT_READ
                        ? TYPE_READ_RF.READ_FAILED
                        : itm.data.LoaiDoc;
                  }
                  return itm;
                });
              }

              return { ...state };
            });
            let writeFailed = await updateReadFailToDb(strSeri);
            if (writeFailed !== true) {
              console.log('Update Read failed to DB is Failed');
            }
          }
        }
      } catch (err) {
        console.log(TAG, err.message);
        return;
      }
    }
  }
};

export const onBtnReadPress = async () => {
  if (checkCondition() === false) {
    setStatus('Chưa có item nào được chọn');
    return;
  }
  if (store.state.hhu.connect !== 'CONNECTED') {
    hookProps.setState(state => {
      state.status = 'Chưa kết nối bluetooth';
      return { ...state };
    });
    Vibration.vibrate([20, 30, 20]);
    return;
  }

  hookProps.setState(state => {
    state.isReading = true;
    state.requestStop = false;
    //state.status = 'Đang đọc ...';
    return { ...state };
  });

  //await BleFunc_StartNotification(ObjSend.id);

  try {
    await readData();
  } catch (err) {
    console.log(TAG, err.message);
  }

  hookProps.setState(state => {
    state.isReading = false;
    state.selectAll = false;
    if (state.status.includes('Đang đọc') === true) {
      state.status = '';
    }
    return { ...state };
  });
  //await BleFunc_StopNotification(ObjSend.id);
};

export const onBtnStopPress = () => {
  hookProps.setState(state => {
    state.requestStop = true;
    return { ...state };
  });
};

export type PropsUpdateDb = {
  seri: string;
  BCSCMIS: string;
  RfCode: string;
  T0: string;
  date: Date;
  oldCapacity: number;
  newCapacity: number;
  Pmax?: string;
  datePmax?: string;
  isWriteHand?: boolean;
  ghiChu?: string;
  updateSucced?: boolean;
  isAbnormal?: boolean;
  stillSaveWhenAbnormal?: boolean;
};
export const updateReadFailToDb = async (seri: string): Promise<boolean> => {
  const valuesSet = {};

  const condition: PropsCondition = {
    data: {},
    logic: '=',
    operator: 'AND',
  };

  condition.data[dataDBTabel.SERY_CTO.id] = seri;
  condition.data[dataDBTabel.LoaiDoc.id as string] = TYPE_READ_RF.HAVE_NOT_READ;

  valuesSet[dataDBTabel.LoaiDoc.id as string] = TYPE_READ_RF.READ_FAILED;

  for (let i = 0; i < 1; i++) {
    const updateSucceed = await CMISKHServices.update(condition, valuesSet);
    if (updateSucceed) {
      console.log('update table succeed');
      return true;
    } else {
      //console.log('update table failed');
    }
  }

  return false;
};

export const updateDataToDB = async (
  props: PropsUpdateDb,
): Promise<boolean> => {
  const valuesSet = {};

  const condition: PropsCondition = {
    data: {},
    logic: '=',
    operator: 'AND',
  };

  //console.log('props:', props);

  let percent: number = 0;

  let isAbnormal: boolean = false;
  let statusAbnormal = '';
  if (props.isWriteHand !== true) {
    if (store.state.appSetting.setting.typeAlarm === 'Value') {
      if (
        props.newCapacity >=
          Number(store.state.appSetting.setting.upperThresholdValue) ||
        props.newCapacity <=
          Number(store.state.appSetting.setting.lowerThresholdValue)
      ) {
        isAbnormal = true;
        statusAbnormal = `
        Seri: ${props.seri}
        Bộ chỉ số: ${props.BCSCMIS}
        Chỉ số hiện tại: ${props.T0} kWh
        Ngưỡng trên: ${store.state.appSetting.setting.upperThresholdValue} kWh
        Ngưỡng dưới: ${store.state.appSetting.setting.lowerThresholdValue} kWh
        Sản lượng thực tế: ${props.newCapacity}`;
      }
    } else {
      percent = (props.newCapacity / props.oldCapacity) * 100;
      if (
        percent >=
          Number(store.state.appSetting.setting.upperThresholdPercent) ||
        percent <= Number(store.state.appSetting.setting.lowerThresholdPercent)
      ) {
        isAbnormal = true;
        statusAbnormal = `
        Seri: ${props.seri}
        Bộ chỉ số: ${props.BCSCMIS}
        Chỉ số hiện tại: ${props.T0} kWh
        Sản lượng mới: ${props.newCapacity} kWh
        Sản lượng cũ: ${props.oldCapacity} kWh
        Ngưỡng trên: ${store.state.appSetting.setting.upperThresholdPercent}%
        Ngưỡng dưới: ${store.state.appSetting.setting.lowerThresholdPercent}%
        Ngưỡng thực tế: ${percent.toFixed(0)}%`;
      }
    }
  }

  let stillSave: boolean = false;
  if (isAbnormal === true) {
    if (props.Pmax) {
      statusAbnormal += `
      Chỉ số: ${props.T0}
      Pmax: ${props.Pmax}
      Ngày Pmax: ${props.datePmax}
      `;
    }
    stillSave = await new Promise(resolve => {
      variable.modalAlert.title = 'Dữ liệu bất thường';
      variable.modalAlert.content = statusAbnormal;
      variable.modalAlert.onDissmiss = () => resolve(false);
      variable.modalAlert.onOKPress = () => resolve(true);

      store?.setValue(state => {
        state.modal.showWriteRegister = true;
        return { ...state };
      });
    });

    props.stillSaveWhenAbnormal = stillSave;

    console.log('stillSave:', stillSave);
  }

  //isAbnormal = false;

  condition.data[dataDBTabel.SERY_CTO.id as string] = props.seri;
  condition.data[dataDBTabel.LOAI_BCS.id as string] = props.BCSCMIS;
  condition.data[dataDBTabel.RF.id as string] = props.RfCode;

  if (isAbnormal) {
    valuesSet[dataDBTabel.LoaiDoc.id as string] =
      TYPE_READ_RF.ABNORMAL_CAPACITY;
  } else {
    // const strDate =
    //   props.date.toLocaleDateString('vi').split('/').join('-') +
    //   ' ' +
    //   props.date.toLocaleTimeString('vi');

    if (props.isWriteHand === true) {
      valuesSet[dataDBTabel.LoaiDoc.id as string] = TYPE_READ_RF.WRITE_BY_HAND;
    } else {
      valuesSet[dataDBTabel.LoaiDoc.id as string] = TYPE_READ_RF.READ_SUCCEED;
    }

    //console.log('valuesSet:', valuesSet);
  }

  if (isAbnormal !== true || (isAbnormal === true && stillSave === true)) {
    const strDate = formatDateTimeDB(props.date);
    valuesSet[dataDBTabel.CS_MOI.id as string] = props.T0;
    valuesSet[dataDBTabel.NGAY_MOI.id as string] = strDate;
    if (props.Pmax && props.datePmax) {
      valuesSet[dataDBTabel.PMAX.id as string] = props.Pmax;
      valuesSet[dataDBTabel.NGAY_PMAX.id as string] = props.datePmax;
    }
    if (props.ghiChu) {
      valuesSet[dataDBTabel.GhiChu.id as string] = props.ghiChu;
    }
  }

  console.log('isAbnormal:', isAbnormal);

  props.isAbnormal = isAbnormal;

  for (let i = 0; i < 3; i++) {
    const updateSucceed = await CMISKHServices.update(condition, valuesSet);
    if (updateSucceed) {
      console.log('update table succeed');
      return true;
    } else {
      console.log('update table failed');
    }
  }

  return false;
};
