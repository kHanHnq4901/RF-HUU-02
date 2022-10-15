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
import {CheckboxButton} from '../../component/checkbox/checkbox';
import {RadioButton} from '../../component/radioButton/radioButton';
import Theme, {
  Colors,
  CommonFontSize,
  CommonHeight,
  Fonts,
  normalize,
  scale,
  scaleHeight,
  sizeScreen,
} from '../../theme';
import * as readParamsController from './controller';
import {onDeInit, onInit} from './controller';
import {onBtnReadPress} from './handleButton';

export const ReadOpticalScreen = () => {
  const hookProps = readParamsController.GetHookProps();
  const navigation = useNavigation();
  React.useEffect(() => {
    onInit();

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

  const styleSelectDate = {...styles.selectDate};
  //console.log('hookProps.state.typeRead:', hookProps.state.typeRead);
  styleSelectDate.color =
    hookProps.state.typeRead === 'Dữ liệu gần nhất'
      ? Colors.caption
      : Colors.primary;

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
                return {...state};
              });
            }}
            style={styles.checkBoxTypeData}
          />
        ))}
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
                  return {...state};
                });
              }
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  normalRow: {flexDirection: 'row', alignItems: 'center'},
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
    width: '50%',
    height: 40 * scaleHeight,
    alignSelf: 'center',
    maxWidth: 350,
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
    //borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    width: sizeScreen.width,
  },
  labelSelectDate: {
    color: Colors.text,
    fontSize: normalize(15),
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
