import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
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
  onLineSelected,
  onModelMeterSelected,
} from './handleButton';

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
        {/* <View style={styles.containerSeri}>
          <TextInput
            style={styles.seri}
            value={hookProps.state.infoDeclare.seriMeter}
            onChangeText={text => {
              hookProps.setState(state => {
                state.infoDeclare.seriMeter = text;
                return {...state};
              });
            }}
            keyboardType="number-pad"
            placeholder="Số NO cơ khí"
          />
        </View> */}
        <NormalTextInput
          label="Seri cơ khí:(*)"
          keyboardType="number-pad"
          maxLength={10}
          // onEndEditing={e => {
          //   e.persist();
          //   hookProps.setState(state => {
          //     state.infoDeclare.seriMeter = e.nativeEvent?.text.trim();
          //     return {...state};
          //   });
          // }}
          onChangeText={text => {
            hookProps.data.infoDeclare.seriMeter = text;
          }}
          ref={hookProps.refSeriMeter}
          onSubmitEditing={() => {
            hookProps.refCustomerName.current?.focus();
          }}
          blurOnSubmit={false}
        />
        <NormalTextInput
          label="Tên khách hàng:(*)"
          // onEndEditing={e => {
          //   e.persist();
          //   hookProps.setState(state => {
          //     state.infoDeclare.customerName = e.nativeEvent?.text.trim();
          //     return {...state};
          //   });
          // }}
          onChangeText={text => {
            hookProps.data.infoDeclare.customerName = text;
          }}
          ref={hookProps.refCustomerName}
          onSubmitEditing={() => {
            hookProps.refCustomerCode.current?.focus();
          }}
          blurOnSubmit={false}
        />
        <NormalTextInput
          label="Mã khách hàng:(*)"
          // onEndEditing={e => {
          //   e.persist();
          //   hookProps.setState(state => {
          //     state.infoDeclare.customerCode = e.nativeEvent?.text.trim();
          //     return {...state};
          //   });
          // }}
          onChangeText={text => {
            hookProps.data.infoDeclare.customerCode = text;
          }}
          ref={hookProps.refCustomerCode}
          onSubmitEditing={() => {
            hookProps.refAddress.current?.focus();
          }}
          blurOnSubmit={false}
        />
        <NormalTextInput
          label="Địa chỉ:"
          // onEndEditing={e => {
          //   e.persist();
          //   hookProps.setState(state => {
          //     state.infoDeclare.address = e.nativeEvent?.text.trim();
          //     return {...state};
          //   });
          // }}
          onChangeText={text => {
            hookProps.data.infoDeclare.address = text;
          }}
          ref={hookProps.refAddress}
          onSubmitEditing={() => {
            hookProps.refPhoneNUmber.current?.focus();
          }}
          blurOnSubmit={false}
        />
        <NormalTextInput
          label="Số điện thoại:"
          maxLength={12}
          keyboardType="number-pad"
          // onEndEditing={e => {
          //   e.persist();
          //   hookProps.setState(state => {
          //     state.infoDeclare.phoneNumber = e.nativeEvent?.text.trim();
          //     return {...state};
          //   });
          // }}
          onChangeText={text => {
            hookProps.data.infoDeclare.phoneNumber = text;
          }}
          ref={hookProps.refPhoneNUmber}
          // onSubmitEditing={() => {
          //   hookProps.refCustomerName.current?.focus();
          // }}
          blurOnSubmit={true}
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

const styles = StyleSheet.create({
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
    width: '50%',
    marginVertical: 10,
    marginHorizontal: 5,
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
    backgroundColor: 'white',
    borderRadius: 10,
    width: '93%',
    elevation: 1,
    //height: 35 * scale,
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
