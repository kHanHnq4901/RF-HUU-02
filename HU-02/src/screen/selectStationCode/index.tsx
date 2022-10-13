import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Colors, normalize, scaleHeight, sizeScreen} from '../../theme';
import {
  GetHookProps,
  hookProps,
  onDeInit,
  onInit,
  PropsTabel,
} from './controller';
import {
  StackWriteBookCodeNavigationProp,
  StackWriteStationCodeNavigationProp,
} from '../../navigation/model/model';
import SelectDropdown from 'react-native-select-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Checkbox} from 'react-native-paper';
import {
  onChangeTextSearch,
  onDropdownSelected,
  onOKPress,
} from './handleButton';
import {Button} from '../../component/button/button';
import throttle from 'lodash.throttle';

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
              return {...item};
            });

            return {...state};
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
  return (
    item.show && (
      <TouchableOpacity
        onPress={() => {
          hookProps.setState(state => {
            state.dataTabel = state.dataTabel.map(itm => {
              if (itm.id === item.id) {
                itm.checked = !itm.checked;
              }
              return {...itm};
            });
            return {...state};
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
          <Text style={styles.title}>{item.columnCode}</Text>
          <View style={{height: 10}} />
          <Text style={styles.subTitle}>
            Đọc thành công: {item.succeedMeter}/ {item.totalMeter}
          </Text>
          <Text style={styles.subTitle}>
            Sản lượng: {item.capacityStation} kWh
          </Text>
        </View>
      </TouchableOpacity>
    )
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

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{hookProps.state.status}</Text>
      <View style={styles.selectSationAndInfo}>
        <View style={styles.containerSelectedStation}>
          <Text style={styles.titleStation}>Chọn trạm</Text>
          <View style={styles.dropdown}>
            <SelectDropdown
              data={hookProps.state.dropdownStationCode}
              ref={ref}
              defaultButtonText=" "
              //defaultValue=" "
              //defaultValueByIndex={0}
              onSelect={selectedItem => {
                //console.log(selectedItem, index);
                onDropdownSelected(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              buttonTextStyle={{color: Colors.primary}}
              rowTextStyle={{color: Colors.primary}}
              buttonStyle={styles.buttonDropDown}
              renderDropdownIcon={() => {
                return <Ionicons name="chevron-down" size={20} />;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
            />
          </View>
        </View>
        <View style={styles.containerInfo}>
          <View style={styles.containerSubInfo}>
            <Text style={styles.textInfo}>
              Tổng công tơ: {hookProps.state.totalMeter}
            </Text>
            <Text style={styles.textInfo}>
              Tổng BCS: {hookProps.state.totalBCS}
            </Text>
          </View>
          <View style={styles.containerSubInfo}>
            <Text style={styles.textInfo}>
              Tổng công tơ trạm: {hookProps.state.totalMeterStation}/{' '}
              {hookProps.state.totalMeter}
            </Text>
            <Text style={styles.textInfo}>
              Tổng BCS trạm: {hookProps.state.totalBCSStation}/{' '}
              {hookProps.state.totalBCS}
            </Text>
          </View>
          <View style={styles.containerSubInfo}>
            <Text style={styles.textInfo}>
              Sản lượng trạm: {hookProps.state.capacityStation} kWh
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.searchArea}>
        <Text style={styles.commonTitle}>Chọn mã quyển</Text>
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
      <View style={styles.containerTable}>
        <RowHeader
          checked={hookProps.state.checkAll}
          title="Danh sách mã cột"
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingHorizontal: 10,
    paddingVertical: 5,
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
    color: Colors.blurPrmiary,
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
