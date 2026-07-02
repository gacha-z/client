import Svg, { Path } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

type Props = {
  size?: number;
  color?: string;
};

export function ExitIcon({ size = 16, color = colors.grey400 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M10 2.66724H3.33334V12.0006C3.33334 12.3542 3.47382 12.6933 3.72387 12.9434C3.97392 13.1934 4.31305 13.3339 4.66668 13.3339H10M10.6667 6.00057L12.6667 8.00057L10.6667 10.0006M12.6667 8.00057H6.00001"
        stroke={color}
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
