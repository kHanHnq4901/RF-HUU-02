import {RouteProp, useRoute} from '@react-navigation/native';
import throttle from 'lodash.throttle';
import React, {useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {Pie} from 'react-native-progress';
import SelectDropdown from 'react-native-select-dropdown';
import {Button} from '../../component/button/button';
import {CheckboxButton} from '../../component/checkbox/checkbox';
import {ModalWriteRegister} from '../../component/modal/modalWriteRegister';
import {StackWriteDataByStationCodeList} from '../../navigation/model/model';
import {TYPE_READ_RF} from '../../service/hhu/defineEM';
import {Colors, normalize, scaleHeight, scaleWidth} from '../../theme';
import {sizeScreen} from '../../theme/index';
import {
  GetHookProps,
  hookProps,
  isCloseToBottom,
  onDeInit,
  onInit,
  onScrollToEnd,
  PropsDataTable,
  variable,
} from './controller';
import {
  onBtnReadPress,
  onChangeTextSearch,
  onCheckBoxTypeReadChange,
  onItemPress,
  onPencilPress,
  onSelectAllPress,
  onSelectedItemDropdown,
  onStopReadPress,
} from './handleButton';
import Entypo from 'react-native-vector-icons/Entypo';
import _ from 'lodash';
import {hookProps as selectStationCodeHook} from '../selectStationCode/controller';
export const SubRow1Memo = React.memo(
  (props: {
    STATION_CODE: string;
    STATION_NAME: string;
    CUSTOMER_NAME: string;
    CUSTOMER_CODE: string;
    ADDRESS: string;
  }) => {
    //console.log('ren SubRow1Memo');
    return (
      <>
        <Text style={styleItemRow.textNormal}>
          Trạm:{' '}
          <Text style={styleItemRow.textImpress}>{props.STATION_NAME}</Text>
          {' - '}
          Mã trạm:{' '}
          <Text style={styleItemRow.textImpress}>{props.STATION_CODE}</Text>
        </Text>
        <Text style={styleItemRow.textNormal}>
          KH:{' '}
          <Text style={styleItemRow.textImpress}>{props.CUSTOMER_NAME}</Text>
          {' - '}
          Mã KH:{' '}
          <Text style={styleItemRow.textImpress}>{props.CUSTOMER_CODE}</Text>
        </Text>
        <Text style={styleItemRow.textNormal}>
          ĐC: <Text style={styleItemRow.textNormal}>{props.ADDRESS}</Text>
        </Text>
      </>
    );
  },
  () => true,
);

export const SubRow2Memo = React.memo(
  (props: {
    TT: string;
    NO_METER: string;
    labelMeter: string;
    NO_MODULE: string;
  }) => {
    //console.log('ren SubRow2Memo');
    return (
      <>
        <Text style={styleItemRow.textNormal}>
          <Text style={styleItemRow.textImpress}>{props.TT}</Text>
          <Text style={styleItemRow.textNormal}>. CK: </Text>
          <Text style={styleItemRow.textImpress}>{props.NO_METER}</Text>
          <Text style={styleItemRow.textNormal}> - {props.labelMeter}</Text>
          <Text style={styleItemRow.textImpress}>{props.NO_MODULE}</Text>
        </Text>
      </>
    );
  },
  () => true,
);

export const SubRow3Memo = React.memo(
  (props: {
    CS_MOI: number;
    CS_CU: number;
    SL_CU: number;
    DateLatch: string;
  }) => {
    //console.log('ren SubRow3Memo');
    const SL_Moi =
      Number(props.CS_MOI) === 0
        ? ' '
        : (Number(props.CS_MOI) - Number(props.CS_CU)).toFixed(2);
    return (
      <>
        <Text style={styleItemRow.textNormal}>
          CS mới: <Text style={styleItemRow.textImpress}>{props.CS_MOI}</Text>
          {' - '}
          cũ: <Text style={styleItemRow.textImpress}>{props.CS_CU}</Text>
          {'     '}
          SL mới: <Text style={styleItemRow.textImpress}>{SL_Moi}</Text>
          {' - '}
          cũ: <Text style={styleItemRow.textImpress}>{props.SL_CU}</Text>
        </Text>
        <Text style={styleItemRow.textNormal}>
          Ngày chốt:{' '}
          <Text style={styleItemRow.textImpress}>{props.DateLatch}</Text>
        </Text>
      </>
    );
  },
  (prev, next) => _.isEqual(prev, next),
);

const IconPencilMemo = React.memo((props: {item: PropsDataTable}) => {
  function _PencilPress() {
    //console.log('pencil press');
    onPencilPress({
      data: props.item,
    });
  }
  return (
    <TouchableOpacity style={styleItemRow.pencil} onPress={_PencilPress}>
      <Entypo name="pencil" size={35} color={Colors.primary} />
    </TouchableOpacity>
  );
});

//ListRenderItemInfo<PropsDatatable>
function ItemStock(item: PropsDataTable) {
  //const item = props.item;
  if (item.show !== true) {
    return null;
  }
  //console.log('ren:', item.stt);
  let backgroundColor;
  if (item.checked === true) {
    backgroundColor = '#e3e6e8';
    //backgroundColor = 'pink';
  } else {
    if (item.data.TYPE_READ === TYPE_READ_RF.HAVE_NOT_READ) {
      backgroundColor = 'white'; //'transparent';
    } else if (item.data.TYPE_READ === TYPE_READ_RF.READ_FAILED) {
      backgroundColor = '#f6a8bf';
    } else if (item.data.TYPE_READ === TYPE_READ_RF.WRITE_BY_HAND) {
      backgroundColor = '#a9f6a8';
    } else if (item.data.TYPE_READ === TYPE_READ_RF.ABNORMAL_CAPACITY) {
      backgroundColor = '#f6f5a9';
    } else if (item.data.TYPE_READ === TYPE_READ_RF.READ_SUCCEED) {
      backgroundColor = '#67f3bb';
    }
  }

  function _onItemPress() {
    onItemPress(item);
  }

  return (
    <TouchableOpacity
      onPress={_onItemPress}
      style={{...styleItemRow.container, backgroundColor: backgroundColor}}>
      {/* <TouchableOpacity style={styleItemRow.pencil} onPress={_PencilPress}>
        <Entypo name="pencil" size={35} color={Colors.primary} />
      </TouchableOpacity> */}
      <View style={styleItemRow.row}>
        <Checkbox status={item.checked ? 'checked' : 'unchecked'} />
        <IconPencilMemo item={item} />
        <SubRow2Memo
          TT={item.stt}
          NO_METER={item.data.NO_METER}
          NO_MODULE={item.data.NO_MODULE}
          labelMeter={item.labelMeter}
        />
      </View>
      <SubRow1Memo
        STATION_CODE={item.data.LINE_ID}
        STATION_NAME={item.data.LINE_NAME}
        CUSTOMER_NAME={item.data.CUSTOMER_NAME}
        CUSTOMER_CODE={item.data.CUSTOMER_CODE}
        ADDRESS={item.data.ADDRESS}
      />
      <SubRow3Memo
        CS_MOI={
          item.data.DATA.length
            ? item.data.DATA[0].cwRegister - item.data.DATA[0].uCwRegister
            : 0
        }
        CS_CU={0}
        SL_CU={0}
        DateLatch={item.data.DATA.length ? item.data.DATA[0].time : ' '}
      />
    </TouchableOpacity>
  );
}

function areEqual(prev: PropsDataTable, next: PropsDataTable) {
  if (
    prev.checked !== next.checked ||
    prev.data.DATA !== next.data.DATA ||
    prev.data.TYPE_READ !== next.data.TYPE_READ
  ) {
    return false;
  }
  return true;
}

const ItemStockMemoried = React.memo(ItemStock, areEqual);

const sizeChartWaiting =
  sizeScreen.width < sizeScreen.height
    ? sizeScreen.width * 0.2
    : sizeScreen.height * 0.2;

export const WriteStationCodeScreen = () => {
  GetHookProps();

  const route =
    useRoute<RouteProp<StackWriteDataByStationCodeList, 'WriteStation'>>();
  const paramsRoute = route.params;

  //console.log('paramsRoute:', paramsRoute);

  const ref = useRef<SelectDropdown | null>(null);

  React.useEffect(() => {
    onInit(paramsRoute, ref);

    return () => {
      onDeInit();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ModalWriteRegister
        title={variable.modalAlert.title}
        info={variable.modalAlert.content}
        onDismiss={variable.modalAlert.onDissmiss}
        onOKPress={variable.modalAlert.onOKPress}
      />
      <View style={{backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          {/* <Text style={styles.label}>Chọn mã cột</Text> */}
          <Text style={styles.percentSucceed}>
            Thành công: {hookProps.state.totalSucceed}/{' '}
            {hookProps.state.totalBCS}
          </Text>
          <Text style={styles.label}>
            {selectStationCodeHook.state.dateEnd.toLocaleDateString('vi')}
            {selectStationCodeHook.state.is0h ? ', 0h' : ''}
          </Text>
        </View>

        <View style={styles.selectColumn}>
          {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {hookProps.state.arrColumnColumnCode.map(column => (
              <ItemColumnMemorized
                key={column}
                column={column}
                selectedColumn={hookProps.state.selectedColumn as string}
              />
            ))}
          </ScrollView> */}
          <View style={styles.containerSearch}>
            {/* <View style={styles.dropdown}>
              <SelectDropdown
                ref={ref}
                buttonStyle={styles.dropdown}
                defaultButtonText="Tất cả"
                data={hookProps.state.arrColumnColumnCode}
                buttonTextStyle={{
                  color: Colors.primary,
                  fontSize: normalize(16),
                }}
                dropdownStyle={{maxHeight: '100%'}}
                rowTextStyle={{fontSize: normalize(18)}}
                //rowTextStyle={{ color: Colors.primary }}
                onSelect={onSelectedItemDropdown}
                buttonTextAfterSelection={selectedItem => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                }}
                rowTextForSelection={item => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item;
                }}
              />
            </View> */}
            <TextInput
              style={styles.searchText}
              placeholder="Tìm kiếm"
              placeholderTextColor={Colors.caption}
              onChangeText={throttle(text => onChangeTextSearch(text), 300)}
            />
            <Button
              style={styles.btn}
              label={
                hookProps.state.isReading
                  ? hookProps.state.requestStop
                    ? 'Đang dừng'
                    : 'Dừng'
                  : 'Đọc'
              }
              onPress={() => {
                //console.log('3');
                if (hookProps.state.isReading !== true) {
                  //console.log('4');
                  onBtnReadPress();
                  //console.log('5');
                } else {
                  //console.log('1');
                  if (hookProps.state.requestStop !== true) {
                    //console.log('2');
                    onStopReadPress();
                  }
                }
              }}
            />
          </View>
          <View style={styles.containerTypeRead}>
            {hookProps.state.arrCheckBoxRead.map(item => (
              <CheckboxButton
                checked={item.checked}
                label={item.label}
                key={item.label}
                onPress={() => {
                  onCheckBoxTypeReadChange(item.label);
                }}
              />
            ))}
          </View>

          <Text style={styles.status}>{hookProps.state.status}</Text>
          {hookProps.state.selectedColumn !== null &&
            hookProps.state.selectedColumn !== 'Tất cả' && (
              <CheckboxButton
                checked={hookProps.state.selectAll}
                label="Chọn hết"
                onPress={onSelectAllPress}
              />
            )}
        </View>
      </View>
      <View style={{flex: 1}}>
        {hookProps.state.isReading && (
          <View style={styles.bigLoading}>
            <Pie progress={0.4} size={sizeChartWaiting} indeterminate={true} />
            {/* <BubblesLoader size={60} /> */}
          </View>
        )}
        <ScrollView
          // ref={refScroll}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              //enableSomeButton();
              //console.log('to end');
              onScrollToEnd();
            }
          }}
          scrollEventThrottle={300}>
          {hookProps.state.dataTable.render.map(item => {
            if (item.show) {
              return <ItemStockMemoried key={item.id} {...item} />;
            } else {
              return null;
            }
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  status: {
    fontSize: normalize(18),
    color: Colors.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    //marginVertical: 5,
    paddingHorizontal: 10,
  },
  selectColumn: {
    marginTop: 15,
  },
  itemColumn: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.border,
    marginHorizontal: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80 * scaleWidth,
  },
  label: {
    fontSize: normalize(15),
    color: Colors.caption,
    paddingHorizontal: 5,
  },
  titleColumn: {
    fontSize: normalize(18),
    //color: Colors.primary,
    color: 'black',
    fontWeight: 'bold',
  },
  containerSearch: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    //marginTop: 10,
    zIndex: 200,
  },
  searchText: {
    borderWidth: 1,
    borderColor: Colors.border,
    flexGrow: 1,
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 10,
    height: 35 * scaleHeight,
    fontSize: normalize(15),
  },
  btn: {
    marginLeft: 10,
    minWidth: 100,
    width: '15%',
    height: 40 * scaleHeight,
    zIndex: 200,

    //backgroundColor: Colors.pink,
  },
  dropdown: {
    width: sizeScreen.width * 0.2,
    borderRadius: 25,
    backgroundColor: '#dcf0f8',
    height: 35 * scaleHeight,
  },
  containerTypeRead: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    //marginBottom: 10,
  },
  percentSucceed: {
    fontSize: normalize(16),
    textAlignVertical: 'center',
    position: 'absolute',
    textAlign: 'center',
    width: 150 * scaleWidth,
    left: sizeScreen.width / 2 - (150 * scaleWidth) / 2,
    color: Colors.blurPrmiary,
  },
  bigLoading: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 80,
    top: 0,
    opacity: 0.5,
    zIndex: 10000000,

    backgroundColor: 'white',
  },
});

export const styleItemRow = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textImpress: {
    fontWeight: 'bold',
    fontSize: normalize(20),
    //color: Colors.primary,
    color: 'black',
  },
  textNormal: {
    fontSize: normalize(18),
    color: 'black',
    //color: Colors.primary,
  },
  pencil: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    //backgroundColor: 'pink',
    top: 5,
    right: 15,
    zIndex: 15,
  },
});
