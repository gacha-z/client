import { Text, View } from 'react-native';

import { ScreenLayout } from '@/components/ScreenLayout';

import { styles } from './index.css';

export default function HomeScreen() {
  return (
    <ScreenLayout title="홈">
      <View style={styles.content}>
        <Text style={styles.welcome}>여행가챠에 오신 것을 환영합니다.</Text>
      </View>
    </ScreenLayout>
  );
}
