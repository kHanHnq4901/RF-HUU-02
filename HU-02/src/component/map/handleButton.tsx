import { Region } from 'react-native-maps';
import { createOpenLink } from 'react-native-open-maps';

export async function onGoogleMapPress(region: Region) {
  const link = createOpenLink({
    provider: 'google',
    // latitude: rest.latitude,
    // longitude: rest.longtitude,
    query: region.latitude + ',' + region.longitude,
    zoom: 0,
    waypoints: [],
  });
  link();
}
