import { Text } from 'react-native';

import { ScreenLayout } from '@/components/ScreenLayout';

import { styles } from './index.css';

export default function SelectScreen() {
  return (
    <ScreenLayout title="증강">
      <Text style={styles.text}>증강 화면이 여기에 표시됩니다.</Text>
    </ScreenLayout>
  );
}
