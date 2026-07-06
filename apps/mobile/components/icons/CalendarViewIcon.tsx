import Svg, { Path } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

type Props = {
  size?: number;
  color?: string;
};

export function CalendarViewIcon({ size = 14, color = colors.grey400 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M12 3.6665H2V5.6665H12V3.6665Z" fill={color} />
      <Path
        d="M6.99913 3.16663H11.0825C11.4033 3.16663 11.6658 3.42913 11.6658 3.74996V11.9166C11.6658 12.2375 11.4033 12.5 11.0825 12.5H2.91579C2.59496 12.5 2.33246 12.2375 2.33246 11.9166V3.74996C2.33246 3.42913 2.59496 3.16663 2.91579 3.16663H6.99913Z"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.08246 3.16654V1.99988M9.91579 3.16654V1.99988"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.08246 7.24988H9.91579"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.08246 9.58325H8.16579"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
