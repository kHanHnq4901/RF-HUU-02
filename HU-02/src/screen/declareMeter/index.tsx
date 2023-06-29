import React, {useEffect} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from '../../component/button/button';
import Loader3 from '../../component/loader3';
import {NormalTextInput} from '../../component/normalTextInput';
import Theme, {Colors, normalize, scale, scaleWidth} from '../../theme';
import {
  GetHookProps,
  hookProps,
  lisStationName,
  listModelMeterName,
  onDeInit,
  onInit,
} from './controller';
import {
  onDeclarePress,
  onGetPositionPress,
  onGoogleMapPress,
  onLineSelected,
  onModelMeterSelected,
  onSearchInfo,
} from './handleButton';
import Feather from 'react-native-vector-icons/Feather';
import MapView, {Marker} from 'react-native-maps';

export const DeclareMeterScreen = () => {
  GetHookProps();
  useEffect(() => {
    onInit();
    return onDeInit;
  }, []);

  return (
    <View style={styles.container}>
      {hookProps.state.isBusy && (
        <View style={styles.containerLoader}>
          <Loader3 />
        </View>
      )}
      <Text style={styles.status}>{hookProps.state.status}</Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        <View style={styles.dropdown}>
          <Text style={styles.label}>Chọn trạm</Text>
          <SelectDropdown
            ref={hookProps.refStation}
            defaultButtonText=" "
            data={lisStationName}
            onSelect={selectedItem => {
              onLineSelected(selectedItem);
            }}
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
            defaultValueByIndex={0}
            renderDropdownIcon={() => (
              <Ionicons
                name="chevron-down"
                size={20 * scale}
                color={Colors.text}
              />
            )}
            buttonStyle={styles.buttonDropdown}
            dropdownStyle={styles.dropdownDropLanger}
            rowTextStyle={styles.textDropdown}
            buttonTextStyle={styles.textDropdownSmall}
          />
        </View>

        <View style={styles.dropdown}>
          <Text style={styles.label}>Chọn loại đồng hồ</Text>
          <SelectDropdown
            ref={hookProps.refModelMeter}
            defaultButtonText=" "
            data={listModelMeterName}
            onSelect={selectedItem => {
              onModelMeterSelected(selectedItem);
            }}
            buttonTextAfterSelection={selectedItem => {
              return selectedItem;
            }}
            rowTextForSelection={item => {
              return item;
            }}
            defaultValueByIndex={0}
            renderDropdownIcon={() => (
              <Ionicons
                name="chevron-down"
                size={20 * scale}
                color={Colors.text}
              />
            )}
            buttonStyle={styles.buttonDropdown}
            dropdownStyle={styles.dropdownDrop}
            rowTextStyle={styles.textDropdown}
            buttonTextStyle={styles.textDropdownSmall}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={hookProps.refScroll}>
        {/* <NormalTextInput
          label="Seri cơ khí:(*)"
          keyboardType="number-pad"
          maxLength={10}

          onChangeText={text => {
            hookProps.data.infoDeclare.seriMeter = text;
          }}
          ref={hookProps.refSeriMeter}
          onSubmitEditing={() => {
            hookProps.refCustomerCode.current?.focus();
          }}
          blurOnSubmit={false}
        /> */}
        <View style={styles.containerSeri}>
          <View style={{flex: 1}}>
            <NormalTextInput
              label="Seri đồng hồ:(*)"
              ref={hookProps.refSeriMeter}
              // style={styles.textInput}

              keyboardType="decimal-pad"
              value={hookProps.state.data.METER_NO}
              onChangeText={text => {
                hookProps.setState(state => {
                  state.data.METER_NO = text;
                  return {...state};
                });
              }}
              // onSubmitEditing={() => {
              //   hookProps.refCustomerCode.current?.focus();
              // }}
            />
          </View>

          <Button
            style={styles.btnSearch}
            label="Tìm kiếm"
            onPress={onSearchInfo}
          />
        </View>

        <NormalTextInput
          label="Mã khách hàng:(*)"
          value={hookProps.state.data.CUSTOMER_CODE}
          onChangeText={text => {
            hookProps.setState(state => {
              state.data.CUSTOMER_CODE = text;
              return {...state};
            });
          }}
          ref={hookProps.refCustomerCode}
          onSubmitEditing={() => {
            //
            // hookProps.refCustomerCode.current?.focus();
            hookProps.refCustomerName.current?.focus();
          }}
          blurOnSubmit={false}
        />
        <NormalTextInput
          label="Tên khách hàng:"
          value={hookProps.state.data.CUSTOMER_NAME}
          onChangeText={text => {
            hookProps.setState(state => {
              state.data.CUSTOMER_NAME = text;
              return {...state};
            });
          }}
          ref={hookProps.refCustomerName}
          onSubmitEditing={() => {
            hookProps.refPhoneNUmber.current?.focus();
          }}
          blurOnSubmit={false}
        />
        <NormalTextInput
          label="Số điện thoại:"
          maxLength={12}
          keyboardType="number-pad"
          value={hookProps.state.data.PHONE}
          onChangeText={text => {
            hookProps.setState(state => {
              state.data.PHONE = text;
              return {...state};
            });
          }}
          ref={hookProps.refPhoneNUmber}
          onSubmitEditing={() => {
            hookProps.refAddress.current?.focus();
          }}
          blurOnSubmit={false}
        />
        <NormalTextInput
          label="Địa chỉ:"
          value={hookProps.state.data.ADDRESS}
          onChangeText={text => {
            hookProps.setState(state => {
              state.data.ADDRESS = text;
              return {...state};
            });
          }}
          ref={hookProps.refAddress}
          // onSubmitEditing={() => {
          //   hookProps.refPhoneNUmber.current?.focus();
          // }}
          blurOnSubmit={true}
        />
        <View style={styles.containerSeri}>
          <View style={{flex: 1}}>
            <NormalTextInput
              label="Toạ độ:"
              // style={styles.textInput}
              editable={false}
              value={hookProps.state.data.COORDINATE}
              onChangeText={text => {
                hookProps.setState(state => {
                  state.data.COORDINATE = text;
                  return {...state};
                });
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.btnUpdate}
            onLongPress={onGoogleMapPress}
            onPress={onGetPositionPress}>
            <Feather name="map-pin" size={normalize(30)} color="#f3d20e" />
          </TouchableOpacity>
        </View>
        <View style={styles.containMapView}>
          <MapView
            // provider="google"
            style={styles.map}
            mapType="standard"
            showsIndoorLevelPicker
            // style={StyleSheet.absoluteFillObject}
            region={hookProps.state.region}
            onPoiClick={e => {
              console.log('onPoiClick:', e.nativeEvent.coordinate);
            }}
            // showsUserLocation
            onRegionChangeComplete={region => {
              console.log('region:', region);
              hookProps.setState(state => {
                state.region = {...region};
                return {...state};
              });
            }}>
            <Marker
              draggable
              coordinate={hookProps.state.position}
              title={hookProps.state.data.METER_NO}
              description={
                hookProps.state.region.latitude +
                ',' +
                hookProps.state.region.longitude
              }
              onDragEnd={e => {
                console.log('onDrag end:');
                if (e.nativeEvent?.coordinate) {
                  const latLog = e.nativeEvent.coordinate;
                  const region = {...hookProps.state.region};
                  region.latitude = latLog.latitude;
                  region.longitude = latLog.longitude;

                  hookProps.setState(state => {
                    state.position = latLog;
                    state.region = region;
                    return {...state};
                  });
                }
              }}
              onPress={() => {
                console.log('onPress');
                onGoogleMapPress();
              }}
            />
          </MapView>
        </View>

        <NormalTextInput
          value={hookProps.state.data.CREATED}
          label="Ngày khai báo:"
          editable={false}

          // onChangeText={text => {
          //   hook.setState(state => {
          //     state.data.CUSTOMER_NAME = text;
          //     return {...state};
          //   });
          // }}
        />
      </ScrollView>

      <Button
        // labelStyle={{color: 'black'}}
        style={styles.styleBtn}
        label="Khai báo"
        onPress={() => {
          onDeclarePress();
        }}
      />
      {/* <Button
        // labelStyle={{color: 'black'}}
        style={styles.styleBtn}
        label="Test"
        onPress={() => {
          test();
        }}
      /> */}
    </View>
  );
};
const heightMap = 350;
const styles = StyleSheet.create({
  containMapView: {
    width: '100%',
    height: heightMap * scale,
  },
  map: {
    width: '100%',
    height: heightMap * scale,
    backgroundColor: 'white',
  },
  btnUpdate: {
    // backgroundColor: '#f3d20e',
    // width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  btnSearch: {
    backgroundColor: '#14f30e',
    width: 100,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.backgroundColor,
    paddingHorizontal: 5,
  },

  status: {
    fontSize: normalize(18),
    color: Colors.primary,
    alignSelf: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    margin: 10,
    alignSelf: 'center',
  },
  containerSeri: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  seri: {
    fontSize: normalize(20),
    color: Colors.text,
    backgroundColor: Colors.backgroundIcon,
    borderRadius: 10,
  },
  styleBtn: {
    marginBottom: 20,
    alignSelf: 'center',
    width: '50%',
    //height: 45 * scale,
    // backgroundColor: Colors.backgroundColor,
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
  textInput: {
    backgroundColor: 'white',
    fontSize: normalize(20),
    borderRadius: 3,
    paddingHorizontal: 10,
    fontFamily: 'Lato-Regular',
    margin: 10,
  },
  dropdown: {
    maxWidth: 200 * scaleWidth,
    margin: 5,
    marginTop: 0,
    width: '45%',
    marginBottom: 5 * scale,
  },
  buttonDropdown: {
    borderWidth: Platform.OS === 'android' ? 0 : 1,
    borderColor: Platform.OS === 'android' ? 'white' : Colors.border,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '93%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  textDropdown: {
    fontSize: normalize(16),
    color: Colors.text,
    fontFamily: 'Lato-Regular',
  },
  textDropdownSmall: {
    fontSize: normalize(15),
    color: Colors.text,
    marginLeft: -10,
    fontFamily: 'Lato-Regular',
  },
  dropdownDrop: {
    backgroundColor: 'white',
    borderRadius: 3,
  },
  dropdownDropLanger: {
    backgroundColor: 'white',
    borderRadius: 3,
    width: '90%',
    maxWidth: 800,
  },
  label: {
    fontSize: normalize(16),
    color: Colors.caption,
    marginBottom: 5,
    fontFamily: 'Lato-Regular',
  },
});
