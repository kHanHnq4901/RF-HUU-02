import { Buffer } from 'buffer';
import { Alert, AlertButton } from 'react-native';
import Snackbar from 'react-native-snackbar';

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getFilExtension = (filename: string): string => {
  return filename.split('.').pop().split(' ')[0];
};

export function isNumeric(str: any) {
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

type PropsShowAlert = {
  title?: string;
  message?: string;
  one?: {
    label: string;
    func: () => void;
  };
  two?: {
    label: string;
    func: () => void;
  };
};

export async function showAlertProps(props: PropsShowAlert) {
  return new Promise<void>((resolve, reject) => {
    const alertButton: AlertButton[] = [];
    if (props.one) {
      alertButton.push({
        text: props.one.label,
        onPress: () => {
          props.one.func();
          resolve();
        },
      });
    }
    if (props.two) {
      alertButton.push({
        text: props.two.label,
        onPress: () => {
          props.two.func();
          resolve();
        },
      });
    }
    if (alertButton.length === 0) {
      alertButton.push({
        text: 'OK',
        onPress: () => {
          resolve();
        },
      });
    }
    Alert.alert(props.title ?? '', props.message ?? '', alertButton);
  });
}

export async function showAlert(
  message: string,
  one?: {
    label: string;
    func: () => void;
  },
  two?: {
    label: string;
    func: () => void;
  },
) {
  return new Promise<void>((resolve, reject) => {
    const alertButton: AlertButton[] = [];
    if (one) {
      alertButton.push({
        text: one.label,
        onPress: () => {
          one.func();
          resolve();
        },
      });
    }
    if (two) {
      alertButton.push({
        text: two.label,
        onPress: () => {
          two.func();
          resolve();
        },
      });
    }
    if (alertButton.length === 0) {
      alertButton.push({
        text: 'OK',
        onPress: () => {
          resolve();
        },
      });
    }
    Alert.alert('', message, alertButton);
  });
}

export function showToast(message: string, gravity?: number): void {
  // if (Platform.OS === 'android') {
  //   ToastAndroid.showWithGravity(message, 2000, gravity ?? ToastAndroid.CENTER);
  // } else {
  //   Alert.alert(message);
  // }
  Snackbar.show({
    text: message,
    duration: Snackbar.LENGTH_SHORT,
  });
}
export const getCurrentDate = (): string => {
  const today = new Date();
  const strDate =
    ('0' + today.getDate()).slice(-2) +
    '/' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '/' +
    today.getFullYear();
  return strDate;
};
export const getCurrentTime = (): string => {
  const today = new Date();
  const strDate =
    ('0' + today.getHours()).slice(-2) +
    ':' +
    ('0' + today.getMinutes()).slice(-2) +
    ':' +
    ('0' + today.getSeconds()).slice(-2);
  return strDate;
};

export function ByteArrayFromHexString(hexString: string): Buffer {
  if (hexString.length % 2 !== 0) {
    return Buffer.alloc(0);
  } /* w w w.  jav  a2 s .  c o  m*/
  let numBytes = hexString.length / 2;
  let byteArray = Buffer.alloc(numBytes);
  for (let i = 0; i < numBytes; i++) {
    const str = hexString.substring(i * 2, i * 2 + 2);
    byteArray[i] = parseInt(str, 16);
  }
  return byteArray;
}
export function ByteArrayFromString(str: string): Buffer {
  let byteArray = Buffer.alloc(str.length);
  for (let i = 0; i < byteArray.byteLength; i++) {
    byteArray[i] = str.charCodeAt(i);
  }
  return byteArray;
}

export function ByteArrayToString(
  buff: Buffer,
  index: number,
  length: number,
  factor?: 0 | 2 | 8 | 16,
  addition?: boolean,
): string {
  let addStr = addition ? ' ' : '';
  let str = '';
  for (let i = index; i < index + length; i++) {
    str += ('0' + buff[i].toString(16)).slice(-2);
    if (addition) {
      str += addStr;
    }
  }
  return str;
}

export function BufferToString(
  buffer: Buffer,
  offset: number,
  length: number,
  factor?: 0 | 2 | 8 | 16,
  addition?: boolean,
): string {
  let str = '';
  for (let i = offset; i < length + offset; i++) {
    str += ('0' + buffer[i].toString(factor)).slice(-2);
    if (addition) {
      str += ' ';
    }
  }
  return str;
}

export const BufferToUtf16 = (
  buff: Buffer,
  startIndex: number,
  length: number,
) => {
  var str = '';
  for (var i = startIndex; i < startIndex + length; i++) {
    str += String.fromCharCode(buff[i]);
  }
  return str;
};

export function StringFromArray(
  buff: number[] | Buffer,
  offset: number,
  length: number,
): string {
  let str = '';
  for (let i = offset; i < offset + length; i++) {
    if (buff[i] === 0) {
      break;
    }
    str += String.fromCharCode(buff[i]);
  }

  return str;
}

export function isAllNumeric(value: string): boolean {
  return /^-?\d+$/.test(value);
}

export function isValidText(str: string) {
  return /^[0-9a-zA-Z()]+$/.test(str);
}
