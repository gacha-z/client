import { Text } from 'react-native';

import { ScreenLayout } from '@/components/ScreenLayout';

import { styles } from './index.css';

export default function MissionLogScreen() {
  return (
    <ScreenLayout title="미션 로그" scrollable headerActions showBack={false}>
      <Text style={styles.text}>미션 로그가 여기에 표시됩니다.</Text>
    </ScreenLayout>
  );
}
