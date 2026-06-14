import Svg, { Path } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

type Props = {
  size?: number;
  color?: string;
};

export function TravelIcon({ size = 24, color = colors.grey400 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.5 6.5V11M7.5 21V15M16.5 6.5V21M16 6.5H8C5.172 6.5 3.757 6.5 2.879 7.379C2 8.257 2 9.672 2 12.5V15C2 17.828 2 19.243 2.879 20.121C3.757 21 5.172 21 8 21H16C18.828 21 20.243 21 21.121 20.121C22 19.243 22 17.828 22 15V12.5C22 9.672 22 8.257 21.121 7.379C20.243 6.5 18.828 6.5 16 6.5Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 6.5C8.5 5.096 8.5 4.393 8.837 3.889C8.98296 3.67053 9.17053 3.48296 9.389 3.337C9.893 3 10.596 3 12 3C13.404 3 14.107 3 14.611 3.337C14.8295 3.48296 15.017 3.67053 15.163 3.889C15.5 4.393 15.5 5.096 15.5 6.5M9 11H6C5.73478 11 5.48043 11.1054 5.29289 11.2929C5.10536 11.4804 5 11.7348 5 12V14C5 14.2652 5.10536 14.5196 5.29289 14.7071C5.48043 14.8946 5.73478 15 6 15H9C9.26522 15 9.51957 14.8946 9.70711 14.7071C9.89464 14.5196 10 14.2652 10 14V12C10 11.7348 9.89464 11.4804 9.70711 11.2929C9.51957 11.1054 9.26522 11 9 11Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
