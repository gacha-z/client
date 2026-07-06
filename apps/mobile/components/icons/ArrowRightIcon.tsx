import Svg, { Path } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

type Props = {
  size?: number;
  color?: string;
};

export function ArrowRightIcon({ size = 16, color = colors.white }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M1.94406 7.776L13.2841 7.776"
        stroke={color}
        strokeWidth={1.296}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.07203 12.3121L13.608 7.77611L9.07203 3.24011"
        stroke={color}
        strokeWidth={1.296}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
