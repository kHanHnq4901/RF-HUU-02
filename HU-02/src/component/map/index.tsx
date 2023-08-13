import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, scale } from '../../theme';
import { onGoogleMapPress } from './handleButton';

type Props = {
  region: Region;
  onChangeRegion: (region: Region) => void;
  // style?: StyleProp<ViewStyle>;
};

export function UserMap(props: Props) {
  const allowChangeRegion = React.useRef(false);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('set allowRegion = true');
      allowChangeRegion.current = true;
    }, 2000);
    return () => {
      if (timeout) {
        clearTimeout(timeout);
        console.log('set allowRegion = false');
        allowChangeRegion.current = false;
      }
    };
  }, []);
  return (
    <View style={styles.containMapView}>
      <Pressable
        // onPress={() => {
        //   onGoogleMapPress(props.region);
        // }}
        style={styles.fakeMarker}>
        <Ionicons
          name="location-sharp"
          color={Colors.primary}
          size={sizeMarkerFake}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          onGoogleMapPress(props.region);
        }}
        style={styles.googleMap}>
        <Image
          source={require('../../asset/images/image/google-maps.png')}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
          }}
        />
      </Pressable>
      <MapView
        provider="google"
        style={styles.map}
        mapType="standard"
        showsIndoorLevelPicker
        showsUserLocation
        showsMyLocationButton
        region={props.region}
        onRegionChangeComplete={(region, detail) => {
          if (allowChangeRegion.current || detail.isGesture) {
            props.onChangeRegion(region);
          }
        }}>
        {}
      </MapView>
    </View>
  );
}

const heightMap = 200;
const sizeMarkerFake = 35;

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: heightMap * scale,
    backgroundColor: 'white',
  },
  containMapView: {
    width: '100%',
    height: heightMap * scale,
    marginBottom: 10,
  },
  fakeMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 1000,
    marginTop: -sizeMarkerFake / 2 - sizeMarkerFake / 1.5,
    marginLeft: -sizeMarkerFake / 2,
  },
  googleMap: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 80 : 10,
    right: 15,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
});
