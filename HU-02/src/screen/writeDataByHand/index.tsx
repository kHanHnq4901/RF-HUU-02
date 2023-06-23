import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import throttle from 'lodash.throttle';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TextInput from 'react-native-text-input-interactive';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from '../../component/button/button';
import {StackWriteDataByBookCodeList} from '../../navigation/model/model';
import Theme, {
  Colors,
  CommonFontSize,
  CommonHeight,
  normalize,
  scale,
} from '../../theme';
import {GetHook, getTableContent, hookProps, onBeforeInit} from './controller';
import {checkCondition, onWriteByHandDone} from './handleButton';

type Props = {
  label: string;
  content: string;
};

const RowTable = (props: Props) => {
  return (
    <View style={styles.rowTable}>
      <View style={styles.lableTable}>
        <Text style={styles.title1}>{props.label}</Text>
      </View>
      <View style={styles.contentTable}>
        <Text style={styles.title2}>{props.content}</Text>
      </View>
    </View>
  );
};
export type PropsData = Props[];

export const WriteDataByHandScreen = () => {
  GetHook();
  const route =
    useRoute<RouteProp<StackWriteDataByBookCodeList, 'WriteByHand'>>();

  const props = route.params;

  const data: PropsData = getTableContent(props.data.data);

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    onBeforeInit(props.data.data);
  }, []);

  // useEffect(() => {
  //   controller.onInit();
  //   return controller.onDeInit;
  // }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          console.log('goBack');
          navigation.goBack();
        }}>
        <Ionicons name="chevron-back" size={30} color={Colors.secondary} />
      </TouchableOpacity>
      <Text style={styles.NO}>{props.data.data.NO_METER}</Text>
      <Text style={styles.status}>{hookProps.state.status}</Text>
      <ScrollView>
        <View style={styles.body}>
          {data.map((item, index) => (
            <RowTable
              key={item.label + index}
              label={item.label}
              content={item.content}
            />
          ))}
          <View style={{marginTop: 15}} />
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <View style={styles.itemInputContainer}>
              <Text style={styles.title4}>Chỉ số mới:(m3)</Text>
              <TextInput
                value={hookProps.state.CS_Moi}
                onChangeText={text => {
                  hookProps.setState(state => {
                    state.CS_Moi = text;
                    return {...state};
                  });
                }}
                editable={hookProps.state.allowWrite}
                keyboardType="numeric"
                textInputStyle={styles.title3}
                placeholder="0"
                placeholderTextColor={Colors.primary}
              />
            </View>

            {/* <TouchableOpacity
              style={styles.selectDate}
              onPress={() => {
                if (hookProps.state.allowWrite !== true) {
                  return;
                }
                DateTimePickerAndroid.open({
                  value: hookProps.state.datePick,
                  mode: 'date',
                  display: 'calendar',
                  onChange: date => {
                    console.log(JSON.stringify(date));

                    if (date.type === 'set') {
                      console.log('setDate');
                      hookProps.setState(state => {
                        state.datePick = new Date(
                          date.nativeEvent.timestamp as number,
                        );
                        return {...state};
                      });
                    }
                  },
                });
              }}>
              <TextInput
                placeholder="Chọn ngày"
                value={hookProps.state.datePick?.toLocaleDateString()}
                textInputStyle={styles.title3}
                //style={styles.searchText}
                editable={false}
                placeholderTextColor={Colors.primary}
                //textInputStyle={styles.selectDate}
              />
            </TouchableOpacity> */}
          </View>

          <View>
            <Text style={styles.title4}>Ghi chú:</Text>
            <TextInput
              multiline
              autoCorrect={false}
              autoComplete="off"
              editable={hookProps.state.allowWrite}
              value={hookProps.state.ghichu}
              onChangeText={text => {
                hookProps.setState(state => {
                  state.ghichu = text;
                  return {...state};
                });
              }}
              //keyboardType="numeric"
              textInputStyle={{
                ...styles.title2,
                height: normalize(100),
                textAlign: 'left',
                textAlignVertical: 'top',
                backgroundColor: '#f0ebec',
                borderWidth: 1,
                color: Colors.primary,
              }}
              // style={{
              //   borderWidth: 1,
              // }}
              // iconContainerStyle={{
              //   borderWidth: 1,
              // }}
              placeholder="..."
              placeholderTextColor={Colors.primary}
            />
          </View>
        </View>
      </ScrollView>
      {hookProps.state.allowWrite && (
        <View style={styles.buttonArea}>
          <Button
            label={hookProps.state.isWriting ? 'Đang ghi' : 'Ghi'}
            style={{width: '50%', alignSelf: 'center', height: 55}}
            onPress={throttle(() => {
              const ok = checkCondition();
              if (ok) {
                onWriteByHandDone(props.data);
              }
            }, 1500)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonArea: {
    marginVertical: 10,
    //width: '50%',
    //alignItems: 'center',
  },
  selectDate: {
    height: CommonHeight,
  },
  itemInputContainer: {
    marginRight: 10,
  },
  rowTable: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  title3: {
    color: Colors.primary,
    fontSize: normalize(20),
    marginVertical: 5,
    width: 150 * scale,
    backgroundColor: '#f0ebec',
    height: CommonHeight,
  },
  lableTable: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#dadadd',
    paddingHorizontal: 3,
    color: Colors.text,
  },
  contentTable: {
    flex: 1,
    //borderWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#dadadd',
    paddingHorizontal: 3,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.backgroundColor,
  },
  title: {
    fontSize: normalize(24),
    margin: 10,
    alignSelf: 'center',
    color: Colors.text,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 15,
    width: 30,
    height: 40,
    borderRadius: 30,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  NO: {
    color: 'black',
    fontSize: normalize(28),
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  body: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  title1: {
    fontSize: normalize(18),
    marginVertical: 5,
    color: Colors.text,
  },
  title2: {
    color: Colors.text,
    fontSize: normalize(20),
    marginVertical: 5,
  },
  title4: {
    color: Colors.text,
    fontSize: normalize(20),
    marginVertical: 5,
  },
  status: {
    color: Colors.primary,
    marginVertical: 3,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: CommonFontSize,
  },
});
