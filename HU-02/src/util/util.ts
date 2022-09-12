import { ToastAndroid } from 'react-native';
import { Buffer } from 'buffer';

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

export function showToast(message: string) {
  // TODO:ToastAndroid.show(message, ToastAndroid.SHORT);
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER,
  );
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

export function ByteArrayToString(
  byteArray: number[],
  factor?: 0 | 2 | 8 | 16,
  addition?: boolean,
): string {
  let addStr = addition ? ' ' : '';
  return byteArray
    .map(value => ('0' + (value & 0xff).toString(factor)).slice(-2))
    .join(addStr);
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
// export function ArrayBufferToString(
//   byteArray: ArrayBuffer,
//   factor?: 0 | 2 | 8 | 16,
// ): string {
//   let str = '';
//   for (let i = 0; i < byteArray.byteLength; i++) {
//     str += ('0' + (byteArray[i] & 0xff).toString(factor)).slice(-2);
//   }
//   return str;
// }
// export const ArrayToUtf16 = (intArray) => {
//   var str = '';
//   for (var i = 0; i < intArray.length; i++) {
//     str += String.fromCharCode(intArray[i]);
//   }
//   return str;
// };
// export function StringToArrayBuffer(str: string) {
//   const arr = new ArrayBuffer(str.length);
//   for (let i = 0; i < str.length; i++) {
//     arr[i] = str.charCodeAt(i);
//   }
//   return arr;
// }
