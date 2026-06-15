import { Text } from 'react-native';

import { ScreenLayout } from '@/components/ScreenLayout';

import { styles } from './index.css';

export default function CollectionScreen() {
  return (
    <ScreenLayout title="도감" scrollable headerActions showBack={false}>
      <Text style={styles.text}>수집한 여행지 도감이 여기에 표시됩니다.</Text>
    </ScreenLayout>
  );
}
