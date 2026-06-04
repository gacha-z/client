import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './index.css';

type HeaderProps = {
  title?: string;
};

/** 앱 최상단 브랜드 영역 */
export function Header({ title = '여행가챠' }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.logo}>✈️</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
