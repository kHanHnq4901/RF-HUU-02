import * as permission from 'react-native-permissions';

const TAG = 'Request Permission: ';

export const requestPermissionGPS = async () => {
  try {
    //let status;
    let result = await permission.check(
      permission.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    switch (result) {
      case permission.RESULTS.UNAVAILABLE:
        console.log(
          TAG,
          'ACCESS_FINE_LOCATION',
          'This feature is not available (on this device / in this context)',
        );
        break;
      case permission.RESULTS.DENIED:
        console.log(
          TAG,
          'ACCESS_FINE_LOCATION',
          'The permission has not been requested / is denied but requestable',
        );
        let status = await permission.request(
          permission.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        if (
          status === permission.RESULTS.GRANTED ||
          status === permission.RESULTS.BLOCKED
        ) {
          return true;
        } else {
          return false;
        }

      case permission.RESULTS.LIMITED:
        console.log(
          TAG,
          'ACCESS_FINE_LOCATION',
          'The permission is limited: some actions are possible',
        );
        break;
      case permission.RESULTS.GRANTED:
        console.log(TAG, 'ACCESS_FINE_LOCATION', 'The permission is granted');
        return true;
      case permission.RESULTS.BLOCKED:
        console.log(
          TAG,
          'ACCESS_FINE_LOCATION',
          'The permission is denied and not requestable anymore',
        );
        return true;
    }
    return false;
  } catch (err) {
    console.log(TAG, 'ACCESS_FINE_LOCATION', err.message);
    return false;
  }
};

export const requestPermissionWriteExternalStorage = async () => {
  try {
    //let status;

    let result = await permission.check(
      permission.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    );
    switch (result) {
      case permission.RESULTS.UNAVAILABLE:
        console.log(
          TAG,
          'WRITE_EXTERNAL_STORAGE',
          'This feature is not available (on this device / in this context)',
        );
        break;
      case permission.RESULTS.DENIED:
        console.log(
          TAG,
          'WRITE_EXTERNAL_STORAGE',
          'The permission has not been requested / is denied but requestable',
        );
        let status = await permission.request(
          permission.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        );
        if (
          status === permission.RESULTS.GRANTED ||
          status === permission.RESULTS.BLOCKED
        ) {
          return true;
        } else {
          return false;
        }

      case permission.RESULTS.LIMITED:
        console.log(
          TAG,
          'WRITE_EXTERNAL_STORAGE',
          'The permission is limited: some actions are possible',
        );
        break;
      case permission.RESULTS.GRANTED:
        //console.log(TAG, 'WRITE_EXTERNAL_STORAGE', 'The permission is granted');
        return true;
      case permission.RESULTS.BLOCKED:
        console.log(
          TAG,
          'WRITE_EXTERNAL_STORAGE',
          'The permission is denied and not requestable anymore',
        );
        return true;
    }
    return false;
  } catch (err) {
    console.log(TAG, 'WRITE_EXTERNAL_STORAGE', err.message);
    return false;
  }
};
