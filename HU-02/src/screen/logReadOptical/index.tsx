import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  InputAccessoryView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button as RNButton,
  Keyboard,
  Platform,
} from 'react-native';
import { Button } from '../../component/button/button';
import { GetPicture } from '../../component/getPicture';
import Loader1 from '../../component/loader1';
import { UserMap } from '../../component/map';
import { NormalTextInput } from '../../component/normalTextInput';
import { StackReadOpticalList } from '../../navigation/model/model';
import Theme, { Colors, normalize } from '../../theme';
import { GetHookProps, hookProps, onDeInit, onInit } from './controller';
import {
  calculateDelta,
  onRegionChangeComplete,
  onSaveLogPress,
} from './handleButton';
import { RadioButton } from '../../component/radioButton/radioButton';

const inputAccessoryViewID = 'uniqueId';

export const LogReadOpticalScreenScreen = () => {
  GetHookProps();

  const route = useRoute<RouteProp<StackReadOpticalList, 'LogReadOptical'>>();

  useEffect(() => {
    onInit(route.params?.data);
    return onDeInit;
  }, []);

  return (
    <View style={styles.container}>
      {hookProps.state.isBusy && (
        <View style={styles.containerLoader}>
          <Loader1 />
        </View>
      )}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <RNButton onPress={() => Keyboard.dismiss()} title="OK" />
        </InputAccessoryView>
      )}
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.row}>
          <NormalTextInput
            styleContainer={{ flex: 1 }}
            label="Seri cơ khí"
            keyboardType="numeric"
            inputAccessoryViewID={inputAccessoryViewID}
            value={hookProps.state.data.seriMeter}
            onChangeText={text => {
              hookProps.setState(state => {
                state.data.seriMeter = text;
                return { ...state };
              });
            }}
          />
          <NormalTextInput
            label="Seri module"
            styleContainer={{ flex: 1 }}
            keyboardType="numeric"
            inputAccessoryViewID={inputAccessoryViewID}
            value={hookProps.state.data.seriModule}
            onChangeText={text => {
              hookProps.setState(state => {
                state.data.seriModule = text;
                return { ...state };
              });
            }}
          />
        </View>
        <View style={styles.row}>
          <NormalTextInput
            label="QCCID"
            styleContainer={{ flex: 0.8 }}
            value={hookProps.state.data.QCCID}
            onChangeText={text => {
              hookProps.setState(state => {
                state.data.QCCID = text;
                return { ...state };
              });
            }}
          />
          <NormalTextInput
            label="RSSI"
            styleContainer={{ flex: 0.2 }}
            value={hookProps.state.data.rssi}
            onChangeText={text => {
              hookProps.setState(state => {
                state.data.rssi = text;
                return { ...state };
              });
            }}
          />
        </View>
        <View style={styles.row}>
          <NormalTextInput
            label="Chỉ số module"
            keyboardType="numeric"
            inputAccessoryViewID={inputAccessoryViewID}
            styleContainer={{ flex: 1 }}
            value={hookProps.state.data.registerModule}
            onChangeText={text => {
              hookProps.setState(state => {
                state.data.registerModule = text;
                return { ...state };
              });
            }}
            onBlur={calculateDelta}
          />
          <NormalTextInput
            styleContainer={{ flex: 1 }}
            label="Chỉ số cơ khí"
            keyboardType="numeric"
            inputAccessoryViewID={inputAccessoryViewID}
            value={hookProps.state.data.registerMeter}
            onChangeText={text => {
              hookProps.setState(state => {
                state.data.registerMeter = text;
                return { ...state };
              });
            }}
            onBlur={calculateDelta}
          />
        </View>
        <View style={styles.row}>
          <NormalTextInput
            styleContainer={{ flex: 1 }}
            label="Sai lệch(lít)"
            editable={false}
            keyboardType="numeric"
            inputAccessoryViewID={inputAccessoryViewID}
            value={hookProps.state.data.deltaRegister}
            onChangeText={text => {
              hookProps.setState(state => {
                state.data.deltaRegister = text;
                return { ...state };
              });
            }}
          />
          <NormalTextInput
            label="Module đã kích hoạt"
            styleContainer={{ flex: 1 }}
            value={hookProps.state.data.active}
            onChangeText={text => {
              hookProps.setState(state => {
                state.data.active = text;
                return { ...state };
              });
            }}
          />
        </View>
        <NormalTextInput
          label="Ghi chú"
          // styleContainer={{ flex: 1 }}
          multiline
          value={hookProps.state.data.note}
          onChangeText={text => {
            hookProps.setState(state => {
              state.data.note = text;
              return { ...state };
            });
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <RadioButton
            label="Đã khắc phục"
            value="Đã fix"
            checked={hookProps.state.data.fixed === true}
            onPress={() => {
              hookProps.setState(state => {
                state.data.fixed = true;
                return { ...state };
              });
            }}
          />
          <RadioButton
            label="Chưa khắc phục"
            value="Chưa fix"
            checked={hookProps.state.data.fixed !== true}
            onPress={() => {
              hookProps.setState(state => {
                state.data.fixed = false;
                return { ...state };
              });
            }}
          />
        </View>

        <Text style={styles.label}> Ảnh:</Text>
        <GetPicture
          images={hookProps.state.images}
          onDeleteImages={image => {
            hookProps.setState(state => {
              state.images = state.images.filter(
                img => img.fileName !== image.fileName,
              );
              return { ...state };
            });
          }}
          onInsertImages={images => {
            hookProps.setState(state => {
              for (let image of images) {
                state.images.push(image);
              }
              state.images = [...state.images];

              return { ...state };
            });
          }}
        />
        <UserMap
          region={hookProps.state.region}
          onChangeRegion={onRegionChangeComplete}
        />

        <Button style={styles.styleBtn} label="Gửi" onPress={onSaveLogPress} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  styleBtn: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    width: '50%',
    //height: 45 * scale,
    // backgroundColor: Colors.backgroundColor,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.backgroundColor,
    // paddingTop: 58 * scale,
    // marginTop: 50,
  },
  title: {
    fontSize: 24,
    margin: 10,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: normalize(16),
    color: Colors.caption,
  },
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
});
