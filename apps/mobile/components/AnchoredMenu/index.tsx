import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { LayoutRectangle, StyleProp, ViewStyle } from 'react-native';
import { Animated, Modal, Pressable, View, useWindowDimensions } from 'react-native';

import { styles } from './index.css';

type AnchoredMenuProps = {
  trigger: ReactNode;
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  align?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  menuStyle?: StyleProp<ViewStyle>;
  offset?: number;
};

export function AnchoredMenu({
  trigger,
  open,
  onClose,
  children,
  align = 'right',
  style,
  menuStyle,
  offset = 4
}: AnchoredMenuProps) {
  const triggerRef = useRef<View>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null);
  const [visible, setVisible] = useState(open);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  useEffect(() => {
    if (!visible) {
      return;
    }

    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
    });
  }, [visible, screenWidth, screenHeight]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true
      }).start();
      return;
    }

    Animated.timing(opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true
    }).start(({ finished }) => {
      if (finished) {
        setVisible(false);
      }
    });
  }, [open, opacity]);

  return (
    <View style={[styles.container, style]}>
      <View ref={triggerRef} collapsable={false} style={styles.triggerWrap}>
        {trigger}
      </View>
      {visible ? (
        <Modal transparent visible animationType="none" onRequestClose={onClose}>
          <Pressable style={styles.backdrop} onPress={onClose}>
            <Animated.View
              style={[
                styles.menu,
                { opacity },
                triggerLayout
                  ? {
                      top: triggerLayout.y + triggerLayout.height + offset,
                      left: align === 'left' ? triggerLayout.x : undefined,
                      right:
                        align === 'right'
                          ? Math.max(screenWidth - (triggerLayout.x + triggerLayout.width), 0)
                          : undefined
                    }
                  : styles.menuHidden,
                menuStyle
              ]}
            >
              <Pressable onPress={() => {}}>{children}</Pressable>
            </Animated.View>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
}
