import Svg, { Path } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

type Props = {
  size?: number;
  color?: string;
};

export function BackIcon({ size = 24, color = colors.black }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.22235 12.7816L14.4447 19.0039L16 17.4486L10.5553 12.0039L16 6.55922L14.4447 5.00391L8.22235 11.2263C8.01614 11.4325 7.9003 11.7122 7.9003 12.0039C7.9003 12.2956 8.01614 12.5753 8.22235 12.7816Z"
        fill={color}
      />
    </Svg>
  );
}
