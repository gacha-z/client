import Svg, { Path } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

type Props = {
  size?: number;
  color?: string;
};

export function BookIcon({ size = 20, color = colors.blue500 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M4.79998 17.6001C4.35998 17.6001 3.98345 17.4436 3.67038 17.1305C3.35731 16.8174 3.20052 16.4406 3.19998 16.0001V3.2001C3.19998 2.7601 3.35678 2.38356 3.67038 2.0705C3.98398 1.75743 4.36051 1.60063 4.79998 1.6001H14.4C14.84 1.6001 15.2168 1.7569 15.5304 2.0705C15.844 2.3841 16.0005 2.76063 16 3.2001V16.0001C16 16.4401 15.8434 16.8169 15.5304 17.1305C15.2173 17.4441 14.8405 17.6006 14.4 17.6001H4.79998ZM4.79998 16.0001H14.4V3.2001H12.8V8.8001L10.8 7.6001L8.79998 8.8001V3.2001H4.79998V16.0001Z"
        fill={color}
      />
    </Svg>
  );
}
