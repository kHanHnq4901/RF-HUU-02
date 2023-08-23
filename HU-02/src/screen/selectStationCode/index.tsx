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
import { Checkbox } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { Button } from '../../component/button/button';
import { CheckboxButton } from '../../component/checkbox/checkbox';
import Loader3 from '../../component/loader3';
import { RadioButton } from '../../component/radioButton/radioButton';
import { StackWriteStationCodeNavigationProp } from '../../navigation/model/model';
import { TypeReadRF } from '../../service/hhu/RF/RfFunc';
import { Colors, normalize, scaleHeight, sizeScreen } from '../../theme';
import {
  dataReadRadioButton,
  GetHookProps,
  hookProps,
  onDeInit,
  onInit,
  PropsTabel,
} from './controller';
import {
  onChangeTextSearch,
  onDateEndPress,
  onOKPress,
  onTestPress,
  upDateMissData,
} from './handleButton';

type PropsRowHeader = {
  checked: boolean;
  title: string;
};

const RowHeader = (props: PropsRowHeader) => {
  return (
    <View style={styles.containerRowTable}>
      <TouchableOpacity
        onPress={() => {
          hookProps.setState(state => {
            let checked = state.dataTabel[0].checked;
            state.dataTabel = state.dataTabel.map(item => {
              item.checked = !checked;
              return { ...item };
            });

            return { ...state };
          });
        }}
        style={styles.checkTabel}>
        <Checkbox
          uncheckedColor={Colors.primary}
          status={props.checked ? 'checked' : 'unchecked'}
        />
      </TouchableOpacity>
      <View style={styles.contentTable}>
        <Text style={styles.title}>{props.title}</Text>
      </View>
    </View>
  );
};

const Row = (item: PropsTabel) => {
  if (item.show !== true) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        hookProps.setState(state => {
          state.dataTabel = state.dataTabel.map(itm => {
            if (itm.id === item.id) {
              itm.checked = !itm.checked;
            }
            return { ...itm };
          });
          return { ...state };
        });
      }}
      style={styles.containerRowTable}>
      <View style={styles.checkTabel}>
        <Checkbox
          uncheckedColor={Colors.primary}
          status={item.checked ? 'checked' : 'unchecked'}
        />
      </View>
      <View style={styles.contentTable}>
        <Text style={styles.title}>{item.meterLine.line.LINE_NAME}</Text>
        <View style={{ height: 10 }} />
        <Text style={styles.subTitle}>
          Dữ liệu thiếu: {item.meterLine.listMeter.length}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const SelectStationCodeScreen = () => {
  GetHookProps();
  const navigation = useNavigation<StackWriteStationCodeNavigationProp>();

  const ref = React.useRef<SelectDropdown>(null);

  React.useEffect(() => {
    onInit(navigation, ref);
    return () => {
      onDeInit();
    };
  }, []);

  const RenderRadioButton = ({ e }: { e: TypeReadRF }) => {
    return useMemo(() => {
      return (
        <RadioButton
          key={e}
          label={e}
          value={e}
          checked={hookProps.state.typeRead === e ? true : false}
          onPress={() => {
            if (hookProps.state.typeRead !== e) {
              hookProps.setState(state => ({ ...state, typeRead: e }));
              if (e === 'Dữ liệu gần nhất') {
                upDateMissData(new Date());
              } else {
                upDateMissData(hookProps.state.dateEnd);
              }
            }
          }}
        />
      );
    }, [hookProps.state.typeRead]);
  };

  const styleSelectDate = { ...styles.selectDate };
  //console.log('hookProps.state.typeRead:', hookProps.state.typeRead);
  styleSelectDate.color =
    hookProps.state.typeRead === 'Dữ liệu gần nhất'
      ? Colors.caption
      : Colors.primary;

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{hookProps.state.status}</Text>
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
            <Text style={styles.labelSelectDate}>Chọn ngày</Text>
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
                      display: 'spinner',
                      onChange: onDateEndPress,
                    });
                  }}>
                  <TextInput
                    // label="Chọn ngày"
                    value={hookProps.state.dateEnd.toLocaleTimeString('vi', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    //onChangeText={() => {}}
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
                    //onChangeText={() => {}}
                    //style={styles.searchText}
                    editable={false}
                    style={styleSelectDate}
                  />
                </TouchableOpacity>
              </>
            )}
            {Platform.OS === 'ios' && (
              <DateTimePicker
                value={hookProps.state.dateStart}
                mode="datetime"
                onChange={onDateEndPress}
                locale="vi"
                textColor={Colors.primary}
                accentColor={Colors.primary}
                themeVariant="light"
              />
            )}
          </View>
        </View>
      </View>

      <View style={styles.rowRadioButton}>
        {dataReadRadioButton.map(e => {
          // console.log('state', hookProps.state.typeRead);
          // console.log('e', e);
          return <RenderRadioButton e={e} key={e} />;
        })}
      </View>
      <View style={styles.searchArea}>
        <Text style={styles.commonTitle}>Tìm mã trạm</Text>
        <TextInput
          style={styles.input}
          //value={hookProps.state.searchText}
          // onChangeText={text => {
          //   hookProps.setState(state => {
          //     state.searchText = text;
          //     return { ...state };
          //   });
          //   throttle(() => onChangeTextSearch(text), 1000);
          // }}
          onChangeText={throttle(text => onChangeTextSearch(text), 250)}
        />
      </View>
      <View style={{ flex: 1 }}>
        {hookProps.state.isLoading && (
          <View style={styles.containerLoader}>
            <Loader3 />
          </View>
        )}

        <View style={styles.containerTable}>
          <RowHeader
            checked={hookProps.state.checkAll}
            title="Danh sách mã trạm"
          />
          <ScrollView>
            {hookProps.state.dataTabel.map(item => {
              return <Row key={item.id} {...item} />;
            })}
          </ScrollView>
        </View>
        <View style={styles.btnArea}>
          <Button
            style={styles.btn}
            label="OK"
            onPress={() => {
              onOKPress(navigation);
            }}
          />
          {/* <Button style={styles.btn} label="Test" onPress={onTestPress} /> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerLoader: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    zIndex: 1000000,
  },
  normalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  selectDate: {
    //width: '80%',
    maxWidth: normalize(120),
    marginLeft: 10,
    // minWidth: 100,
    //height: 38,
    color: Colors.primary,
    fontSize: normalize(18),
    height: 35 * scaleHeight,
    borderRadius: 15,
    backgroundColor: '#ebeef5',
    paddingHorizontal: 10,
    // position: 'absolute',
    // zIndex: 1,
  },
  rowRadioButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  conatinerSelectDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  rowSelectDate: {
    //borderRadius: 15,
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  labelSelectDate: {
    color: Colors.caption,
    fontSize: normalize(15),
  },
  container: {
    flex: 1,
    //paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.backgroundColor,
  },
  btnArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
    width: '100%',
  },
  btn: {
    width: '30%',
    height: 40 * scaleHeight,
  },
  subTitle: {
    fontSize: normalize(16),
    color: Colors.blurPrmiary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    flexGrow: 1,
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 10,
    height: 35 * scaleHeight,
    fontSize: normalize(17),
  },
  status: {
    fontSize: normalize(16),
    color: Colors.primary,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  commonTitle: {
    fontSize: normalize(16),
    color: Colors.caption,
  },
  selectSationAndInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  containerSelectedStation: {},
  containerInfo: {
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 1,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  containerSubInfo: {
    marginVertical: 10,
  },
  textInfo: {
    textAlign: 'right',
    color: Colors.primary,
    fontSize: normalize(16),
  },
  titleStation: {
    color: Colors.blurPrmiary,
    fontSize: normalize(17),
  },
  dropdown: {
    //width: sizeScreen.width * 0.3,
    alignItems: 'center',
    //backgroundColor: 'pink',
    marginTop: 20,
    //marginLeft: 35,
  },
  buttonDropDown: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: sizeScreen.width * 0.4,
  },
  searchArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5 * scaleHeight,
  },
  containerTable: {
    marginTop: 10,
    flex: 1,
  },
  containerRowTable: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 10,
    //borderRadius: 15,
    //borderWidth: 1,
    //borderColor: Colors.primary,
  },
  checkTabel: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    //borderColor: Colors.primary,
  },
  contentTable: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'white',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  title: {
    fontSize: normalize(20),
    color: Colors.primary,
    marginVertical: 5,
    fontWeight: 'bold',
  },
});
