import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  NativeModules,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
} from 'react-native';
import {VictoryPie} from 'victory-native';
import {DetailDB} from '../../component/detailDB';
import Theme, {Colors, normalize} from '../../theme';
import {
  colorsChart,
  dummyDataTable,
  GetHook,
  hookProps,
  labelsStock,
  onDeInit,
  onInit,
} from './controller';

const deviceWidth = Dimensions.get('window').width;

const ItemLabel = (props: {label: string; quantity: number; color: string}) => {
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
      <Text style={{color: 'black', fontSize: normalize(20)}}>
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
        style={{width: '100%', height: '20%'}}
        source={require('../../asset/images/logo/logo.png')}
      />
      <Text style={styles.text}>HU-02</Text>
      <ImageBackground
        resizeMode="contain"
        style={{flex: 1}}
        source={require('../../asset/images/image/ov.jpg')}
      />
      <ImageBackground
        resizeMode="contain"
        style={{flex: 1}}
        source={require('../../asset/images/image/model1.jpg')}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          {/* <Text style={styles.title}>
            {total === 0 ? 'Chưa có dữ liệu' : 'Tỉ lệ lấy dữ liệu'}
          </Text> */}
          <View style={styles.chart}>
            <VictoryPie
              //ref={ref}
              colorScale={colorsChart}
              data={total === 0 ? dummyDataTable : hookProps.state.graphicData}
              width={deviceWidth}
              labels={({datum}) => {
                //console.log('lb:', datum.x);
                return datum.x;
              }}
              height={heightChart}
              innerRadius={innerRadius}
              radius={radius}
              labelRadius={labelRadius}
              // animate={{
              //   duration: 2000,
              //   easing: 'bounce',
              // }}
              labelPosition="centroid"
              horizontal={true}
              //cornerRadius={2}
              padAngle={is100percent ? 0 : 1}
              style={{
                labels: {
                  fill: 'black',
                  fontSize: normalize(18),
                  //backgroundColor: 'pink',
                  padding: 15,
                  width: '100%',
                  margin: 20,
                },
                parent: {
                  padding: 0,
                  width: '100%',
                  margin: 0,
                },
                data: {},
              }}
            />
          </View>
        </View>
        {/* <View
          style={{
            width: '100%',
            height: 80,
          }}
        /> */}
        <View style={styles.detailTitleChart}>
          {labelsStock.map((item, index) => {
            let quantity = 0;
            if (index === labelsStock.length - 1) {
              for (let itm of hookProps.state.graphicData) {
                quantity += itm.y;
              }
            } else {
              quantity = hookProps.state.graphicData[index].y;
            }

            return (
              <ItemLabel
                color={colorsChart[index]}
                label={item}
                key={index.toString() + item}
                quantity={quantity}
              />
            );
          })}
        </View>
        {/* <DetailDB data={hookProps.state.detailDB} /> */}
      </ScrollView>
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
