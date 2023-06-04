import React from 'react';
import {View} from 'react-native';
import Svg, {Path, G} from 'react-native-svg';

type Props = {
  size: number;
  color: string;
};

const strokeWidth = 3;

export function IconFaceID(props: Props) {
  return (
    <View>
      <Svg
        width={props.size}
        height={props.size}
        viewBox="0 0 24.00 24.00"
        fill="none">
        <G id="SVGRepo_bgCarrier" stroke-width="0" />

        <G
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <G id="SVGRepo_iconCarrier">
          <Path
            d="M7 3H5C3.89543 3 3 3.89543 3 5V7"
            stroke={props.color}
            stroke-width={strokeWidth}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M17 3H19C20.1046 3 21 3.89543 21 5V7"
            stroke={props.color}
            stroke-width={strokeWidth}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M16 8L16 10"
            stroke={props.color}
            stroke-width={strokeWidth}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M8 8L8 10"
            stroke={props.color}
            stroke-width={strokeWidth}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M9 16C9 16 10 17 12 17C14 17 15 16 15 16"
            stroke={props.color}
            stroke-width={strokeWidth}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M12 8L12 13L11 13"
            stroke={props.color}
            stroke-width={strokeWidth}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M7 21H5C3.89543 21 3 20.1046 3 19V17"
            stroke={props.color}
            stroke-width={strokeWidth}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M17 21H19C20.1046 21 21 20.1046 21 19V17"
            stroke={props.color}
            stroke-width={strokeWidth}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </G>
      </Svg>
    </View>
  );
}
