import {Dimensions, PixelRatio, Platform} from 'react-native';
import StyleCommon from './styleCommon';
import Color from 'color';
export const Colors = {
  primary: '#f71336',
  secondary: '#0ef76c',
  tertiary: 'white',
  backgroundIcon: '#e6ebeb',
  colorIcon: '#929492',
  text: '#1e1f1e',
  backgroundColor: 'white',
  pink: '#fc8598',
  border: '#dadadd',
  blurPrmiary: Color('#f71336').lighten(0.35).toString(),
  caption: Color('#929492').darken(0.2).toString(),
};
1;

export const Fonts = undefined;
//'SourceCodePro-SemiBold';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('screen');
export const sizeScreen = Dimensions.get('screen');

const getSaleWidth = (widthScreen: number): number => {
  let scaleWidth = 1;
  if (widthScreen > 392) {
    scaleWidth = 1 + (widthScreen - 392) / widthScreen;
  } else if (widthScreen < 392) {
    scaleWidth = 1 - (-widthScreen + 392) / widthScreen;
  } else {
    scaleWidth = 1;
  }
  return scaleWidth;
};
const getSaleHeight = (heightScreen: number): number => {
  let scaleWidth = 1;
  if (heightScreen > 776) {
    scaleWidth = 1 + (heightScreen - 776) / heightScreen;
  } else if (heightScreen < 776) {
    scaleWidth = 1 - (-heightScreen + 776) / heightScreen;
  } else {
    scaleWidth = 1;
  }
  return scaleWidth;
};
export const scaleWidth = getSaleWidth(SCREEN_WIDTH);
export const scaleHeight = getSaleHeight(SCREEN_HEIGHT);
export const scale = scaleWidth < scaleHeight ? scaleWidth : scaleHeight;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

console.log('color:', Colors.blurPrmiary);
console.log('width:', SCREEN_WIDTH);
console.log('height:', SCREEN_HEIGHT);
console.log('scale:', scale);
console.log('scaleWidth:', scaleWidth);
console.log('scaleHeight:', scaleHeight);

console.log(Dimensions.get('screen'));

export const CommonFontSize = normalize(18);
export const CommonHeight = 45 * scaleHeight;

console.log('CommonFontSize:', CommonFontSize);

export default {StyleCommon, Colors, Fonts};
