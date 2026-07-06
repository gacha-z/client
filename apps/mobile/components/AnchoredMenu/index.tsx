import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { styles } from './index.css';

type AnchoredMenuProps = {
  trigger: ReactNode;
  open: boolean;
  children: ReactNode;
  align?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  menuStyle?: StyleProp<ViewStyle>;
  offset?: number;
};

export function AnchoredMenu({
  trigger,
  open,
  children,
  align = 'right',
  style,
  menuStyle,
  offset = 4
}: AnchoredMenuProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.triggerWrap}>{trigger}</View>
      {open && (
        <View
          style={[
            styles.menu,
            align === 'left' ? styles.menuLeft : styles.menuRight,
            { marginTop: offset },
            menuStyle
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}
