import Svg, { Path } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

type Props = {
  size?: number;
  color?: string;
};

export function CoffeeIcon({ size = 12, color = colors.blue700 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 20H10.943M10.943 20H11.057M10.943 20C9.09638 19.985 7.33051 19.2408 6.03006 17.9297C4.72961 16.6186 3.99994 14.8467 4 13V8.923C4 8.413 4.413 8 4.923 8H17.077C17.587 8 18 8.413 18 8.923V9M11.057 20H18M11.057 20C12.9036 19.985 14.6695 19.2408 15.9699 17.9297C17.2704 16.6186 18.0001 14.8467 18 13M18 9H19.5C20.163 9 20.7989 9.26339 21.2678 9.73223C21.7366 10.2011 22 10.837 22 11.5C22 12.163 21.7366 12.7989 21.2678 13.2678C20.7989 13.7366 20.163 14 19.5 14H18V13M18 9V13M15 3L14 5M12 3L11 5M9 3L8 5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
