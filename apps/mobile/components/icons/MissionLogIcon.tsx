import Svg, { Path } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

type Props = {
  size?: number;
  color?: string;
};

export function MissionLogIcon({ size = 24, color = colors.grey400 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3ZM9.54 9L6.87 5H9.47L12.14 9H9.54ZM14.54 9L11.87 5H14.47L17.14 9H14.54ZM4 5H4.46L7.13 9H4V5ZM4 19V11H20V9H19.54L16.87 5H20V19H4Z"
        fill={color}
      />
    </Svg>
  );
}
