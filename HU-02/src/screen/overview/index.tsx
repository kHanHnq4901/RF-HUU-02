import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Theme, { normalize } from '../../theme';
import { GetHook, onDeInit, onInit } from './controller';

const deviceWidth = Dimensions.get('window').width;

const ItemLabel = (props: {
  label: string;
  quantity: number;
  color: string;
}) => {
  return (
    <View style={styles.containerItemLabel}>
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 15,
          backgroundColor: props.color,
          marginRight: 10,
        }}
      />
      <Text style={{ color: 'black', fontSize: normalize(20) }}>
        {props.label + ': ' + props.quantity}
      </Text>
    </View>
  );
};

const heightChart = deviceWidth * 1;
const innerRadius = (deviceWidth / 2) * 0.3;
const connerRadius = (deviceWidth / 2) * 0.3 * 0.9;
const radius = (deviceWidth / 2) * 0.9;
const labelRadius = ((radius + innerRadius) / 2) * 0.8;

export const OverViewScreen = () => {
  GetHook();

  const navigation = useNavigation();

  React.useEffect(() => {
    onInit(navigation);
    return () => {
      onDeInit(navigation);
    };
  }, []);
  // let total = 0;
  // let is100percent = false;

  // for (let itm of hookProps.state.graphicData) {
  //   total += itm.y;
  // }
  // for (let itm of hookProps.state.graphicData) {
  //   if (total === itm.y) {
  //     is100percent = true;
  //   }
  // }

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={{ width: '100%', height: '20%' }}
        source={require('../../asset/images/logo/logo.png')}
      />
      <Text style={styles.text}>HU-02</Text>
      <ImageBackground
        resizeMode="contain"
        style={{ flex: 1 }}
        source={require('../../asset/images/image/ov.jpg')}
      />
      <ImageBackground
        resizeMode="contain"
        style={{ flex: 1 }}
        source={require('../../asset/images/image/model1.jpg')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.OS === 'android' ? 'kufam-semi-bold-italic' : 'Kufam',
    fontSize: normalize(60),
    marginBottom: 50,
    color: '#f3688f',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.backgroundColor,
  },
  title: {
    fontSize: normalize(24),
    margin: 10,
    alignSelf: 'center',
  },
  chart: {
    //backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  detailTitleChart: {
    justifyContent: 'center',
    //alignItems: 'center',
    flex: 1,
    flexGrow: 1,
    paddingLeft: deviceWidth / 2 - 50,
    marginBottom: 20,
    marginTop: 25,
    //backgroundColor: 'pink',
  },
  containerItemLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 15,
  },
});
