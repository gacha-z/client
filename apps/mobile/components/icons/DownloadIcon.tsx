import Svg, { Path } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

type Props = {
  size?: number;
  color?: string;
};

export function DownloadIcon({ size = 20, color = colors.blue500 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 2.5V12.5M10 12.5L6.25 8.75M10 12.5L13.75 8.75"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.75 14.5V15.8333C3.75 16.7538 4.49619 17.5 5.41667 17.5H14.5833C15.5038 17.5 16.25 16.7538 16.25 15.8333V14.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
