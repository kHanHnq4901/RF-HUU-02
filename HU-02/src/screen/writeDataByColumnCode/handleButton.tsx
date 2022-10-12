import { Vibration } from 'react-native';
import { apsReadRfGCS } from '../../service/hhu/aps/hhuApsGCS';
import { formatDateTimeDB } from '../../service/hhu/aps/util';
import {
  getRFCodeBySeriAndStockRFCode,
  TYPE_READ_RF,
} from '../../service/hhu/defineEM';
import { sleep } from '../../util/util';
import {
  convertApsResponse2PropsInsertDb,
  PropsUpdateDb,
  updateDataToDB,
  updateReadFailToDb,
} from '../writeDataByBookCode/handleButton';
import {
  addMoreItemToRender,
  hookProps,
  navigation,
  PropsDatatable,
  PropsTable,
  store,
} from './controller';

const TAG = 'Handle Btn Write Data By Column Code';

const setStatus = (value: string) => {
  hookProps.setState(state => {
    state.status = value;
    return { ...state };
  });
};

export function onSelectAllPress() {
  hookProps.setState(state => {
    state.selectAll = !state.selectAll;
    for (let key in state.dataTable) {
      state.dataTable[key] = state.dataTable[key].map(item => {
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

const funcFilter = (
  dataTable: PropsTable,
  filter: PropsFilter,
): { dataTable: PropsTable; totalBCS: number; totalSucceed: number } => {
  console.log('filter', filter);
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
    if (itm.show === true) {
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
    return { ...itm };
  });

  dataTable.render = [];
  dataTable.noRender = totalData;

  dataTable = addMoreItemToRender(dataTable);

  //console.log('dataTable.render.length:', dataTable.render[0].show);

  return {
    dataTable: dataTable,
    totalBCS: totalBCS,
    totalSucceed: totalSucceed,
  };
};

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
    //console.log('dataTable.render.length:', result.dataTable.render[0].show);
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
    Vibration.vibrate([100, 200, 100]);
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

export function onStopReadPress() {
  hookProps.setState(state => {
    state.requestStop = true;
    return { ...state };
  });
}
