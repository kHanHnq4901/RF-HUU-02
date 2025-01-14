import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import throttle from 'lodash.throttle';
import React, { useMemo } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Row, Rows, Table } from 'react-native-table-component';
import { Button } from '../../component/button/button';
import { CheckboxButton } from '../../component/checkbox/checkbox';
import { RadioButton } from '../../component/radioButton/radioButton';
import {
  DrawerNavigationProps,
  StackReadOpticalNavigationProp,
} from '../../navigation/model/model';
import Theme, {
  Colors,
  CommonFontSize,
  Fonts,
  normalize,
  scaleHeight,
  sizeScreen,
} from '../../theme';
import * as readParamsController from './controller';
import {
  GetHookProps,
  hookProps,
  navigationStackReadOptical,
  onDeInit,
  onInit,
} from './controller';
import {
  onBtnReadPress,
  onDateEndPress,
  onDateStartPress,
} from './handleButton';

export const ReadOpticalScreen = () => {
  GetHookProps();

  const navigationDrawer = useNavigation<DrawerNavigationProps>();
  React.useEffect(() => {
    onInit();

    return onDeInit;
  }, []);

  const RenderRadioButton = ({ e }: { e: any }) => {
    return useMemo(() => {
      return (
        <RadioButton
          key={e}
          label={e}
          value={e}
          checked={hookProps.state.typeRead === e ? true : false}
          onPress={() => {
            hookProps.setState(state => ({ ...state, typeRead: e }));
          }}
        />
      );
    }, [hookProps.state.typeRead]);
  };

  const RenderTable = () => {
    return useMemo(() => {
      return (
        <Table
          borderStyle={{
            borderWidth: 2,
            borderColor: '#c8e1ff',
            backgroundColor: 'white',
          }}>
          {/* <Row
            data={readParamsController.dataHeaderTable}
            style={styles.head}
            textStyle={styles.headerTabel}
          /> */}
          <Rows data={hookProps.state.dataTable} textStyle={styles.text} />
        </Table>
      );
    }, [...hookProps.state.dataTable]);
  };

  const styleSelectDate = { ...styles.selectDate };
  //console.log('hookProps.state.typeRead:', hookProps.state.typeRead);
  styleSelectDate.color =
    hookProps.state.typeRead === 'Dữ liệu gần nhất'
      ? Colors.caption
      : Colors.primary;

  // const itemCheckBoxNbiot = hookProps.state.typeData.items.find(
  //   item => item.label === 'Nbiot',
  // );

  // const isNbiotChecked = itemCheckBoxNbiot?.checked === true ? true : false;

  return (
    <View style={styles.conatiner}>
      {/* <Text style={styles.seri}>{'Seri: ' + hookProps.state.seri}</Text> */}

      <View style={styles.selectedTypeData}>
        {hookProps.state.typeData.items.map((item, index) => (
          <CheckboxButton
            key={item.label}
            label={item.label}
            checked={item.checked as boolean}
            onPress={() => {
              hookProps.setState(state => {
                state.typeData.items[index].checked =
                  !state.typeData.items[index].checked;
                return { ...state };
              });
            }}
            style={styles.checkBoxTypeData}
          />
        ))}
      </View>
      {hookProps.state.typeData.items[1].checked && (
        <>
          <View style={styles.normalRow}>
            <View>
              <CheckboxButton
                checked={hookProps.state.is0h}
                label="0h"
                onPress={() => {
                  hookProps.setState(state => {
                    state.is0h = !state.is0h;
                    return { ...state };
                  });
                }}
              />
            </View>
            <View style={styles.rowSelectDate}>
              <View style={styles.conatinerSelectDate}>
                <Text style={styles.labelSelectDate}>Bắt đầu</Text>

                {Platform.OS === 'android' && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        if (hookProps.state.typeRead === 'Dữ liệu gần nhất') {
                          return;
                        }
                        DateTimePickerAndroid.open({
                          value: hookProps.state.dateStart,
                          mode: 'time',
                          display: 'clock',
                          onChange: onDateStartPress,
                        });
                      }}>
                      <TextInput
                        // label="Chọn ngày"
                        value={hookProps.state.dateStart.toLocaleTimeString(
                          'vi',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                        onChangeText={() => {}}
                        //style={styles.searchText}
                        editable={false}
                        style={styleSelectDate}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (hookProps.state.typeRead === 'Dữ liệu gần nhất') {
                          return;
                        }
                        DateTimePickerAndroid.open({
                          value: hookProps.state.dateStart,
                          mode: 'date',
                          display: 'calendar',
                          onChange: onDateStartPress,
                        });
                      }}>
                      <TextInput
                        // label="Chọn ngày"
                        value={hookProps.state.dateStart.toLocaleDateString(
                          'vi',
                        )}
                        onChangeText={() => {}}
                        //style={styles.searchText}
                        editable={false}
                        style={styleSelectDate}
                      />
                    </TouchableOpacity>
                  </>
                )}
                {Platform.OS === 'ios' && (
                  <>
                    <DateTimePicker
                      value={hookProps.state.dateStart}
                      mode="datetime"
                      onChange={onDateStartPress}
                      locale="vi"
                      textColor={Colors.primary}
                      accentColor={Colors.primary}
                      themeVariant="light"
                    />
                  </>
                )}
              </View>
              <View style={styles.conatinerSelectDate}>
                <Text style={styles.labelSelectDate}>Kết thúc</Text>
                {Platform.OS === 'android' && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        if (hookProps.state.typeRead === 'Dữ liệu gần nhất') {
                          return;
                        }
                        DateTimePickerAndroid.open({
                          value: hookProps.state.dateEnd,
                          mode: 'time',
                          display: 'clock',
                          onChange: onDateEndPress,
                        });
                      }}>
                      <TextInput
                        // label="Chọn ngày"
                        value={hookProps.state.dateEnd.toLocaleTimeString(
                          'vi',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                        onChangeText={() => {}}
                        //style={styles.searchText}
                        editable={false}
                        style={styleSelectDate}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (hookProps.state.typeRead === 'Dữ liệu gần nhất') {
                          return;
                        }
                        DateTimePickerAndroid.open({
                          value: hookProps.state.dateEnd,
                          mode: 'date',
                          display: 'calendar',
                          onChange: onDateEndPress,
                        });
                      }}>
                      <TextInput
                        // label="Chọn ngày"
                        value={hookProps.state.dateEnd.toLocaleDateString('vi')}
                        onChangeText={() => {}}
                        //style={styles.searchText}
                        editable={false}
                        style={styleSelectDate}
                      />
                    </TouchableOpacity>
                  </>
                )}
                {Platform.OS === 'ios' && (
                  <>
                    <DateTimePicker
                      value={hookProps.state.dateStart}
                      mode="datetime"
                      onChange={onDateEndPress}
                      locale="vi"
                      textColor={Colors.primary}
                      accentColor={Colors.primary}
                      themeVariant="light"
                    />
                  </>
                )}
              </View>
            </View>
          </View>
          <View style={styles.rowRadioButton}>
            {readParamsController.dataReadRadioButton.map(e => {
              // console.log('state', hookProps.state.typeRead);
              // console.log('e', e);
              return <RenderRadioButton e={e} key={e} />;
            })}
          </View>
        </>
      )}

      <Text style={styles.status}>{hookProps.state.status}</Text>
      <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
        <Row
          data={readParamsController.dataHeaderTable}
          style={styles.head}
          textStyle={styles.headerTabel}
        />
      </Table>
      <ScrollView style={styles.table}>
        <RenderTable />
      </ScrollView>
      <View style={styles.btnBottom}>
        {hookProps.state.isReading === false ? (
          <Button
            style={styles.button}
            label="Đọc"
            onPress={throttle(onBtnReadPress, 1000)}
          />
        ) : (
          <Button
            style={styles.button}
            label={hookProps.state.requestStop ? 'Đang dừng ...' : 'Dừng'}
            onPress={() => {
              if (hookProps.state.requestStop === false) {
                hookProps.setState(state => {
                  state.requestStop = true;
                  return { ...state };
                });
              }
            }}
          />
        )}
        <Button
          style={styles.button1}
          label={hookProps.state.isSaving ? 'Đang lưu...' : 'Lưu log'}
          onPress={() => {
            navigationDrawer.navigate('StackReadOptical', {
              screen: 'LogReadOptical',
              params: {
                data: hookProps.state.dataOpticalResPonseObj,
              },
            });
            // navigation.navigate('LogReadOptical', {
            //   data: hookProps.state.dataOpticalResPonseObj,
            // });
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  normalRow: { flexDirection: 'row', alignItems: 'center' },
  conatiner: {
    flex: 1,
    backgroundColor: 'white',
  },
  status: {
    color: Theme.Colors.primary,
    fontSize: CommonFontSize,
    marginBottom: 3,
    textAlign: 'center',
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rowSeri: {
    flexDirection: 'row',
    marginBottom: 10,
    //justifyContent: 'space-between',
    paddingRight: 10,
  },
  button: {
    width: '40%',
    height: 40 * scaleHeight,
    alignSelf: 'center',
    maxWidth: 350,
  },
  button1: {
    width: '40%',
    height: 40 * scaleHeight,
    alignSelf: 'center',
    maxWidth: 350,
    backgroundColor: Colors.secondary,
  },
  checkBoxTypeData: {
    marginRight: 5,
    backgroundColor: '#f8daaf',
    borderRadius: 20,
    paddingHorizontal: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  btnBottom: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rowRadioButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  selectedTypeData: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //backgroundColor: '#ebeef5',
    justifyContent: 'space-around',
    borderRadius: 10,
    marginBottom: 10,
  },
  table: {
    flex: 1,
    marginBottom: 10,
  },
  head: {
    height: 35 * scaleHeight,
    backgroundColor: '#f1f8ff',
  },

  rowSelectDate: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginLeft: 15,
  },
  labelSelectDate: {
    color: Colors.text,
    fontSize: normalize(15),
    marginLeft: 10,
  },
  conatinerSelectDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  selectDate: {
    //width: '80%',
    maxWidth: normalize(120),
    marginLeft: 10,
    // minWidth: 100,
    //height: 38,
    color: Colors.primary,
    fontSize: normalize(16),
    height: 35 * scaleHeight,
    borderRadius: 15,
    backgroundColor: '#ebeef5',
    paddingHorizontal: 10,
    // position: 'absolute',
    // zIndex: 1,
  },
  text: {
    margin: 10,
    fontSize: CommonFontSize,
    fontFamily: Fonts,
    color: 'black',
    // fontWeight: 'bold',
  },
  headerTabel: {
    fontWeight: 'bold',
    fontSize: normalize(15),
    textAlign: 'center',
    fontFamily: Fonts,
    color: Colors.text,
  },
  containerTable: {
    flex: 1,
    width: sizeScreen.width,
  },
  seri: {
    color: Colors.primary,
    fontSize: normalize(23),
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center',
    marginVertical: 10,
  },
});
