import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import throttle from 'lodash.throttle';
import React, {useMemo} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Row, Rows, Table} from 'react-native-table-component';
import {Button} from '../../component/button/button';
import {RadioButton} from '../../component/radioButton/radioButton';
import {AutoCompleteInput} from '../../component/TextInputSugesstion';
import Theme, {
  Colors,
  CommonFontSize,
  CommonHeight,
  Fonts,
  normalize,
  scale,
  scaleHeight,
} from '../../theme';
import * as readParamsController from './controller';
import {itemTypeMeter, onDeInit, onInit} from './controller';
import * as handleButton from './handleButton';
import {filterSeri, onEditSeriDone} from './handleButton';
import {CheckboxButton} from '../../component/checkbox/checkbox';
import {NormalTextInput} from '../../component/normalTextInput';

export const ReadParameterScreen = () => {
  const hookProps = readParamsController.GetHookProps();
  const navigation = useNavigation();
  React.useEffect(() => {
    onInit(navigation);

    return onDeInit;
  }, []);

  const RenderRadioButton = ({e}: {e: any}) => {
    return useMemo(() => {
      return (
        <RadioButton
          key={e}
          label={e}
          value={e}
          checked={hookProps.state.typeRead === e ? true : false}
          onPress={() => {
            hookProps.setState(state => ({...state, typeRead: e}));
          }}
        />
      );
    }, [hookProps.state.typeRead]);
  };

  const RenderTable = () => {
    return useMemo(() => {
      return (
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
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

  const styleSelectDate = {...styles.selectDate};
  //console.log('hookProps.state.typeRead:', hookProps.state.typeRead);
  styleSelectDate.color =
    hookProps.state.typeRead === 'Dữ liệu gần nhất'
      ? Colors.caption
      : Colors.primary;

  return (
    <View style={Theme.StyleCommon.container}>
      <View style={styles.rowSeri}>
        <View style={styles.containerSeri}>
          <AutoCompleteInput
            value={hookProps.state.seri}
            filter={filterSeri}
            onEditDone={onEditSeriDone}
            keyboardType="numeric"
            selectTextOnFocus={true}
            onChangeText={text =>
              hookProps.setState(state => ({...state, seri: text}))
            }
            onSelectedItem={item =>
              hookProps.setState(state => ({...state, seri: item}))
            }
            placeholder="Nhập số Seri"
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-around',
            marginLeft: 15,
          }}>
          {itemTypeMeter.map(item => {
            return (
              <RadioButton
                key={item.label}
                label={item.label}
                value={item.value as string}
                checked={
                  hookProps.state.typeMeter === item.value ? true : false
                }
                onPress={() => {
                  hookProps.setState(state => ({
                    ...state,
                    typeMeter: item.value as unknown as null,
                  }));
                }}
              />
            );
          })}
        </View>
      </View>
      <View style={styles.normalRow}>
        <View>
          <CheckboxButton
            checked={hookProps.state.is0h}
            label="0h"
            onPress={() => {
              hookProps.setState(state => {
                state.is0h = !state.is0h;
                return {...state};
              });
            }}
          />
        </View>
        <View style={styles.rowSelectDate}>
          <View style={styles.conatinerSelectDate}>
            <Text style={styles.labelSelectDate}>Bắt đầu</Text>
            <TouchableOpacity
              onPress={() => {
                if (hookProps.state.typeRead === 'Dữ liệu gần nhất') {
                  return;
                }
                DateTimePickerAndroid.open({
                  value: hookProps.state.dateStart,
                  mode: 'time',
                  display: 'clock',
                  onChange: date => {
                    //console.log(JSON.stringify(date));

                    if (date.type === 'set') {
                      hookProps.setState(state => {
                        state.dateStart = new Date(
                          date.nativeEvent.timestamp as string | number,
                        );
                        console.log(state.dateStart.toLocaleString());
                        return {...state};
                      });
                    }
                  },
                });
              }}>
              <TextInput
                // label="Chọn ngày"
                value={hookProps.state.dateStart.toLocaleTimeString()}
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
                  onChange: date => {
                    //console.log(JSON.stringify(date));

                    if (date.type === 'set') {
                      hookProps.setState(state => {
                        state.dateStart = new Date(
                          date.nativeEvent.timestamp as string | number,
                        );
                        console.log(state.dateStart.toLocaleString());
                        return {...state};
                      });
                    }
                  },
                });
              }}>
              <TextInput
                // label="Chọn ngày"
                value={hookProps.state.dateStart.toLocaleDateString()}
                onChangeText={() => {}}
                //style={styles.searchText}
                editable={false}
                style={styleSelectDate}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.conatinerSelectDate}>
            <Text style={styles.labelSelectDate}>Kết thúc</Text>
            <TouchableOpacity
              onPress={() => {
                if (hookProps.state.typeRead === 'Dữ liệu gần nhất') {
                  return;
                }
                DateTimePickerAndroid.open({
                  value: hookProps.state.dateEnd,
                  mode: 'time',
                  display: 'clock',
                  onChange: date => {
                    //console.log(JSON.stringify(date));

                    if (date.type === 'set') {
                      hookProps.setState(state => {
                        state.dateEnd = new Date(
                          date.nativeEvent.timestamp as string | number,
                        );
                        console.log(state.dateEnd.toLocaleString());
                        return {...state};
                      });
                    }
                  },
                });
              }}>
              <TextInput
                // label="Chọn ngày"
                value={hookProps.state.dateEnd.toLocaleTimeString()}
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
                  onChange: date => {
                    console.log(JSON.stringify(date));

                    if (date.type === 'set') {
                      hookProps.setState(state => {
                        state.dateEnd = new Date(
                          date.nativeEvent.timestamp as string | number,
                        );
                        return {...state};
                      });
                    }
                  },
                });
              }}>
              <TextInput
                // label="Chọn ngày"
                value={hookProps.state.dateEnd.toLocaleDateString()}
                onChangeText={() => {}}
                //style={styles.searchText}
                editable={false}
                style={styleSelectDate}
              />
            </TouchableOpacity>
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

      <Text style={styles.status}>{hookProps.state.status}</Text>
      <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
        <Row
          data={readParamsController.dataHeaderTable}
          style={styles.head}
          textStyle={styles.headerTabel}
        />
      </Table>
      <ScrollView style={styles.table}>
        <RenderTable />
        {hookProps.state.typeRead === 'Tức thời' && (
          <View style={styles.containerRegisterMeterArea}>
            <NormalTextInput
              label="Chỉ số cơ khí (lít): "
              // value="123456"
              ref={hookProps.registerMeter.ref}
              // onChangeText={text => {
              //   hookProps.registerMeter.value = text;
              // }}
              keyboardType="numeric"
              onEndEditing={e => {
                let registerMeter = Number(e.nativeEvent.text);
                let delta: string = hookProps.state.registerModule
                  ? (
                      Number(hookProps.state.registerModule) - registerMeter
                    ).toString()
                  : ' ';
                hookProps.setState(state => {
                  state.registerMeter = e.nativeEvent.text;
                  state.deltaRegister = delta;
                  return {...state};
                });
              }}
            />
            <NormalTextInput
              label="Sai lệch (lít): "
              editable={false}
              value={hookProps.state.deltaRegister}
              // style={{backgroundColor: Colors.backgroundIcon}}
            />
            <NormalTextInput
              label="Ghi chú: "
              // value="123456 hfsjfl;s jflsfjls jfsljfls jkfskf;lskfs;  fsklfsklmfsl jfkldfn fjkfkkf klfsdfkn"
              multiline
              ref={hookProps.userNote.ref}
              // onChangeText={text => {
              //   hookProps.userNote.value = text;
              // }}
              onEndEditing={e => {
                hookProps.setState(state => {
                  state.userNote = e.nativeEvent.text;

                  return {...state};
                });
              }}
            />
          </View>
        )}
      </ScrollView>
      <View style={styles.btnBottom}>
        {hookProps.state.isReading === false ? (
          <Button
            style={styles.button}
            label="Đọc"
            onPress={throttle(handleButton.onBtnReadPress, 1000)}
          />
        ) : (
          <Button
            style={styles.button}
            label={hookProps.state.requestStop ? 'Đang dừng ...' : 'Dừng'}
            onPress={() => {
              if (hookProps.state.requestStop === false) {
                hookProps.setState(state => {
                  state.requestStop = true;
                  return {...state};
                });
              }
            }}
          />
        )}
        {hookProps.state.typeRead === 'Tức thời' && (
          <Button
            style={styles.buttonSave}
            label="Lưu"
            onPress={throttle(handleButton.onSaveLogPress, 1000)}
          />
        )}
      </View>
      {/* <Button style={styles.btnRead} label="Đọc" onPress={() => {}} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  normalRow: {flexDirection: 'row', alignItems: 'center'},
  status: {
    color: Theme.Colors.primary,
    fontSize: CommonFontSize,
    marginBottom: 3,
    textAlign: 'center',
  },
  rowSeri: {
    flexDirection: 'row',
    marginBottom: 10,
    //justifyContent: 'space-between',
    paddingRight: 10,
  },
  button: {
    width: '50%',
    height: 40 * scaleHeight,
    alignSelf: 'center',
    maxWidth: 150,
  },
  buttonSave: {
    width: '50%',
    height: 40 * scaleHeight,
    alignSelf: 'center',
    maxWidth: 150,
    backgroundColor: Colors.secondary,
  },
  checkBoxTypeData: {
    marginRight: 5,
    backgroundColor: '#f8daaf',
    borderRadius: 20,
    paddingHorizontal: 10,
    elevation: 1,
  },
  btnBottom: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
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
    backgroundColor: '#ebeef5',
    justifyContent: 'space-around',
    borderRadius: 10,
    marginBottom: 10,
  },
  table: {
    flex: 1,
    marginBottom: 10,
  },
  head: {
    height: 40 * scaleHeight,
    backgroundColor: '#f1f8ff',
  },
  dropdown: {
    maxWidth: 300,
    width: '40%',
    marginRight: 10,
    height: CommonHeight,
    marginBottom: 15,
  },
  selectTimeAnd0h: {
    marginLeft: 0,
    marginTop: -10,
    flexDirection: 'row',
    alignItems: 'center',
    height: CommonHeight,
    //flexWrap: 'wrap',
    flex: 1,
    //justifyContent: 'space-around',
    //backgroundColor: 'pink',
  },
  rowSelectDate: {
    //borderRadius: 15,
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginLeft: 15,
    // backgroundColor: 'pink',
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
    minWidth: 100,
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
  seri: {
    fontSize: normalize(20),

    width: '100%',
    maxWidth: 300,
    //backgroundColor: 'pink',
    fontFamily: Fonts,
    height: CommonHeight * scale,
    color: Colors.primary,
    backgroundColor: '#dde3f0',
  },
  containerSeri: {
    width: '45%', //sizeScreen.width * 0.45,
    maxWidth: 300,
    height: CommonHeight * scale,
    backgroundColor: 'pink',
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    zIndex: Number.MAX_VALUE,
  },
  retries: {
    fontSize: 15,
    width: 70,
    //marginLeft: -50,
    fontFamily: Fonts,
    padding: 0,
    height: 35,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginVertical: 0,

    //maxWidth: 400,
    //elevation: 1,
  },
  containerRegisterMeterArea: {
    width: '100%',
    marginVertical: 15,
  },
});
