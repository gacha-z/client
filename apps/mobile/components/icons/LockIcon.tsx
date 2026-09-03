import Svg, { Path, Rect } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

type Props = {
  size?: number;
  color?: string;
};

export function LockIcon({ size = 18, color = colors.grey400 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="10" width="14" height="10" rx="2" stroke={color} strokeWidth="2" />
      <Path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
