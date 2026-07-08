import Svg, { Path } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

type Props = {
  size?: number;
  color?: string;
};

export function MovieIcon({ size = 16, color = colors.white }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M13.3334 2H2.66671C1.93337 2 1.33337 2.6 1.33337 3.33333V12.6667C1.33337 13.4 1.93337 14 2.66671 14H13.3334C14.0667 14 14.6667 13.4 14.6667 12.6667V3.33333C14.6667 2.6 14.0667 2 13.3334 2ZM6.36004 6L4.58004 3.33333H6.31337L8.09337 6H6.36004ZM9.69337 6L7.91337 3.33333H9.64671L11.4267 6H9.69337ZM2.66671 3.33333H2.97337L4.75337 6H2.66671V3.33333ZM2.66671 12.6667V7.33333H13.3334V6H13.0267L11.2467 3.33333H13.3334V12.6667H2.66671Z"
        fill={color}
      />
    </Svg>
  );
}
