import {store} from '../../component/drawer/drawerContent/controller';
import {PropsDataModel} from '../../database/model';
import {PushDataToServer} from '../../service/api';
import {
  PropsUpdateData2DB,
  updateDataToDB,
  updateReadFailToDb,
  updateSentToDb,
} from '../../service/database';
import {emitEventFailure} from '../../service/event';
import {PropsResponse} from '../../service/hhu/Ble/hhuFunc';
import {TYPE_READ_RF} from '../../service/hhu/defineEM';
import {
  OpticalDailyProps,
  OpticalFunc_Read,
} from '../../service/hhu/Optical/opticalFunc';
import {
  PropsModelRadio,
  RfFunc_Read,
  TypeReadRF,
} from '../../service/hhu/RF/RfFunc';
import {sleep} from '../../util';
import {hookProps as selectStationCodeHook} from '../selectStationCode/controller';
import {
  addMoreItemToRender,
  hookProps,
  navigation,
  PropsDataTable,
  PropsTable,
} from './controller';

const TAG = 'Handle Btn Write Data By Column Code: ';

const setStatus = (value: string) => {
  hookProps.setState(state => {
    state.status = value;
    return {...state};
  });
};

export function onSelectAllPress() {
  hookProps.setState(state => {
    state.selectAll = !state.selectAll;
    for (let key in state.dataTable) {
      state.dataTable[key] = state.dataTable[key].map(item => {
        if (
          item.data.TYPE_READ === TYPE_READ_RF.READ_SUCCEED ||
          item.data.TYPE_READ === TYPE_READ_RF.ABNORMAL_CAPACITY ||
          item.data.TYPE_READ === TYPE_READ_RF.WRITE_BY_HAND
        ) {
          item.checked = false;
        } else {
          item.checked = state.selectAll;
        }
        return {...item};
      });
    }

    return {...state};
  });
}

export function onItemPress(item: PropsDataTable) {
  hookProps.setState(state => {
    for (let key in state.dataTable) {
      state.dataTable[key] = state.dataTable[key].map(itm => {
        if (itm.data.NO_METER === item.data.NO_METER) {
          if (
            item.data.TYPE_READ === TYPE_READ_RF.READ_SUCCEED ||
            item.data.TYPE_READ === TYPE_READ_RF.WRITE_BY_HAND
          ) {
            itm.checked = false;
          } else {
            itm.checked = !itm.checked;
          }
        }
        return {...itm};
      });
    }
    return {...state};
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
): {dataTable: PropsTable; totalBCS: number; totalSucceed: number} => {
  console.log('filter', filter);
  let totalBCS = 0;
  let totalSucceed = 0;
  let totalData: PropsDataTable[] = [];
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
      // if (itm.data.MA_COT === filter.column) {
      //   itm.show = true;
      // } else {
      //   itm.show = false;
      // }
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
            if (itm.data.TYPE_READ === TYPE_READ_RF.HAVE_NOT_READ) {
              itm.show = true;
              break;
            }
          }
          if (filter.isAbnormal) {
            if (itm.data.TYPE_READ === TYPE_READ_RF.ABNORMAL_CAPACITY) {
              itm.show = true;
              break;
            }
          }
          if (filter.isReadFailed) {
            if (itm.data.TYPE_READ === TYPE_READ_RF.READ_FAILED) {
              itm.show = true;
              break;
            }
          }
          if (filter.isWriteHand) {
            if (itm.data.TYPE_READ === TYPE_READ_RF.WRITE_BY_HAND) {
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
          if (itm.data.NO_MODULE.toLowerCase().includes(searchText)) {
            itm.show = true;
            break;
          }

          if (itm.data.LINE_ID.toLowerCase().includes(searchText)) {
            itm.show = true;
            break;
          }

          if (itm.data.CUSTOMER_NAME.toLowerCase().includes(searchText)) {
            itm.show = true;
            break;
          }
          if (itm.data.CUSTOMER_CODE.toLowerCase().includes(searchText)) {
            itm.show = true;
            break;
          }
          if (itm.data.ADDRESS.toLowerCase().includes(searchText)) {
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
        itm.data.TYPE_READ === TYPE_READ_RF.READ_SUCCEED ||
        itm.data.TYPE_READ === TYPE_READ_RF.WRITE_BY_HAND
      ) {
        totalSucceed++;
      }
    }
    return {...itm};
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
    return {...state};
  });
}

export function onCheckBoxTypeReadChange(label: string) {
  hookProps.setState(state => {
    state.arrCheckBoxRead = state.arrCheckBoxRead.map(cb => {
      if (cb.label === label) {
        cb.checked = !cb.checked;
      }
      return {...cb};
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
    return {...state};
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
    return {...state};
  });
}

type PropsPencil = {
  data: PropsDataTable;
};

export function onPencilPress(props: PropsPencil) {
  //console.log('navigation:', props.navigation);
  navigation.navigate('WriteByHand', {
    data: props.data,
  });
}

async function pushDataServer(listUpdate: PropsUpdateData2DB[]) {
  console.log(TAG, 'push data to server');
  for (let itemUpdate of listUpdate) {
    //console.log('here:', JSON.stringify(itemUpdate.data));

    let ret = await PushDataToServer({
      seri: itemUpdate.seri,
      data: itemUpdate.data,
    });

    if (ret === true) {
      updateSentToDb(itemUpdate.seri, itemUpdate.dateQuery, true);
      hookProps.setState(state => {
        for (let key in state.dataTable) {
          for (let itmUp of listUpdate) {
            const indexCurRow = state.dataTable[key].findIndex(
              itm =>
                itm.data.NO_METER === itmUp.seri &&
                itm.data.DATE_QUERY === itmUp.dateQuery,
            );
            //console.log('indexrow:', indexCurRow);
            if (indexCurRow !== -1) {
              state.dataTable[key][indexCurRow] = {
                ...state.dataTable[key][indexCurRow],
              };
              state.dataTable[key][indexCurRow].data = {
                ...state.dataTable[key][indexCurRow].data,
              };
              state.dataTable[key][indexCurRow].data.IS_SENT = true;
            }
          }
        }
        let totalSentSucceed = 0;
        for (let key in state.dataTable) {
          for (let itm of state.dataTable[key] as PropsDataTable[]) {
            if (
              itm.data.TYPE_READ === TYPE_READ_RF.READ_SUCCEED ||
              itm.data.TYPE_READ === TYPE_READ_RF.WRITE_BY_HAND ||
              (itm.data.TYPE_READ === TYPE_READ_RF.ABNORMAL_CAPACITY &&
                Number(itm.data.DATA.length) !== 0)
            ) {
              if (itm.data.IS_SENT === true) {
                totalSentSucceed++;
              }
            }
          }
        }
        state.totalSent2ServerSucceed = totalSentSucceed.toString();

        return {...state};
      });
    } else {
    }
  }
}

const readData = async () => {
  let numRetries = Number(store.state.appSetting.numRetriesRead);
  if (numRetries <= 0) {
    numRetries = 1;
  }

  const typeReadData = hookProps.state.typeRead;
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
      let result: PropsResponse = {
        bSucceed: false,
        message: '',
        obj: null,
      };
      try {
        let strSeri: string = item.data.NO_METER;
        const typeReadRf: TypeReadRF = selectStationCodeHook.state.typeRead;
        const is0h = selectStationCodeHook.state.is0h;
        const dateEnd = selectStationCodeHook.state.dateEnd;
        const dateQuery = dateEnd.toLocaleDateString('vi');
        const dateStart = new Date();
        dateStart.setDate(dateEnd.getDate() - 8);
        console.log('strSeri:', strSeri);
        setStatus('Đang đọc ' + strSeri + ' ...');

        const dataDailyList: PropsDataModel = [];

        for (let j = 0; j < numRetries; j++) {
          if (typeReadData === 'RF(Lora)') {
            result = await RfFunc_Read({
              seri: strSeri,
              typeAffect: 'Đọc 1',
              typeRead: typeReadRf,
              is0h: is0h,
              numNearest: 10,
              dateStart: dateStart,
              dateEnd: dateEnd,
            });
          } else {
            result = await OpticalFunc_Read({
              seri: strSeri,
              typeAffect: 'Đọc 1',
              typeRead: typeReadRf,
              is0h: is0h,
              numNearest: 10,
              dateStart: dateStart,
              dateEnd: dateEnd,
            });
          }

          console.log(TAG, 'result:', JSON.stringify(result));

          if (result.bSucceed === true) {
            if (typeReadData === 'RF(Lora)') {
              const modelRadio: PropsModelRadio = result.obj;
              if (!modelRadio.data.length) {
                console.log('len data = 0');
                result.bSucceed = false;
              } else {
                for (let dat of modelRadio.data) {
                  dataDailyList.push({
                    // time: dat[
                    //   'Thời điểm chốt (full time)'
                    // ] as unknown as string,
                    time: dat['Thời điểm chốt'] ?? 'here',
                    cwRegister: Number(dat.Xuôi),
                    uCwRegister: Number(dat.Ngược),
                  });
                }
              }
            } else {
              const dataDaily = result.obj as OpticalDailyProps[];
              if (!dataDaily.length) {
                console.log('len data = 0');
                result.bSucceed = false;
              } else {
                for (let dat of dataDaily) {
                  dataDailyList.push({
                    // time: dat[
                    //   'Thời điểm chốt (full time)'
                    // ] as unknown as string,
                    time: dat['Thời điểm chốt'] ?? 'here',
                    cwRegister: Number(dat['Dữ liệu xuôi']),
                    uCwRegister: Number(dat['Dữ liệu ngược']),
                  });
                }
              }
            }

            if (result.bSucceed === true) {
              const listUpdate: PropsUpdateData2DB[] = [];

              // only get listUpdate, no need update hook
              hookProps.setState(state => {
                for (let key in state.dataTable) {
                  state.dataTable[key] = state.dataTable[key].map(itm => {
                    if (itm.data.NO_METER === strSeri) {
                      listUpdate.push({
                        seri: strSeri,
                        data: dataDailyList,
                        typeRead: TYPE_READ_RF.READ_SUCCEED,
                        dateQuery: dateQuery,
                      });
                    }
                    return itm;
                  });
                }
                return state;
              });
              let statusWriteFailed = '';
              let totalUpdateFailed = 0;
              for (let itemUpdate of listUpdate) {
                let updateDbSucceess = await updateDataToDB(itemUpdate);
                if (updateDbSucceess !== true) {
                  totalUpdateFailed++;
                }
              }
              let status = 'Đọc thành công ' + ' seri: ' + strSeri;
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
                        itm.data.NO_METER === strSeri &&
                        itm.data.DATE_QUERY === itemUpdate.dateQuery,
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

                      console.log('test here');

                      // state.dataTable[key][indexCurRow].data.TYPE_READ =
                      //   TYPE_READ_RF.READ_SUCCEED;
                      if (
                        // itemUpdate.isAbnormal !== true ||
                        // (itemUpdate.isAbnormal &&
                        //   itemUpdate.stillSaveWhenAbnormal)
                        true
                      ) {
                        state.dataTable[key][indexCurRow].data.DATA =
                          itemUpdate.data;
                        state.dataTable[key][indexCurRow].data.DATE_QUERY =
                          dateQuery;

                        if (itemUpdate.note) {
                          state.dataTable[key][indexCurRow].data.NOTE =
                            itemUpdate.note;
                        }
                        console.log('data here:', itemUpdate.data);
                      }
                      // node = state.dataTable[key][indexCurRow];
                    }
                  }
                }
                let totalSucceed = 0;
                for (let key in state.dataTable) {
                  for (let itm of state.dataTable[key]) {
                    if (
                      itm.data.TYPE_READ === TYPE_READ_RF.READ_SUCCEED ||
                      itm.data.TYPE_READ === TYPE_READ_RF.WRITE_BY_HAND ||
                      (itm.data.TYPE_READ === TYPE_READ_RF.ABNORMAL_CAPACITY &&
                        Number(itm.data.CS_MOI) !== 0)
                    ) {
                      totalSucceed++;
                    }
                  }
                }
                state.totalSucceed = totalSucceed.toString();
                return {...state};
              });
              //push data to server
              console.log('comment pushData 2 Sever');

              //pushDataServer(listUpdate);

              index = -1; // reset index -1 ++ = 0
              break;
            } else {
            }
          }
        }
        if (result.bSucceed !== true) {
          emitEventFailure();
          hookProps.setState(state => {
            state.status =
              'Đọc thất bại seri ' + strSeri + ': ' + result.message;
            for (let key in state.dataTable) {
              state.dataTable[key] = state.dataTable[key].map(itm => {
                if (itm.data.NO_METER === strSeri) {
                  itm = {...itm};
                  itm.data = {...itm.data};
                  itm.checked = false;
                  itm.data.TYPE_READ =
                    itm.data.TYPE_READ === TYPE_READ_RF.HAVE_NOT_READ
                      ? TYPE_READ_RF.READ_FAILED
                      : itm.data.TYPE_READ;
                }
                return itm;
              });
            }
            return {...state};
          });
          //console.log('comment pushData 2 Sever');
          let writeFailed = await updateReadFailToDb(strSeri, dateQuery);
          if (writeFailed !== true) {
            console.log('Update Read failed to DB is Failed');
          }
        }
      } catch (err) {
        console.log(TAG, err.message);
        emitEventFailure();
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
      return {...state};
    });
    emitEventFailure();
    return;
  }

  hookProps.setState(state => {
    state.isReading = true;
    state.requestStop = false;
    //state.status = 'Đang đọc ...';
    return {...state};
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
    return {...state};
  });
  //await BleFunc_StopNotification(ObjSend.id);
};

export function onStopReadPress() {
  hookProps.setState(state => {
    state.requestStop = true;
    return {...state};
  });
}
