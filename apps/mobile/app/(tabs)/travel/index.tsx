import { Text } from 'react-native';

import { ScreenLayout } from '@/components/ScreenLayout';

import { styles } from './index.css';

export default function TravelListScreen() {
  return (
    <ScreenLayout title="여행 목록" scrollable headerActions showBack={false}>
      <Text style={styles.text}>나의 여행 목록이 여기에 표시됩니다.</Text>
    </ScreenLayout>
  );
}
