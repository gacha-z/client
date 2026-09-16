import { Text, View } from 'react-native';

import type { SetlogEntry } from '@travel-gacha/types';

import { styles } from './index.css';

type MissionLogCardProps = {
  setlog: SetlogEntry;
};

export function MissionLogCard({ setlog }: MissionLogCardProps) {
  const time = setlog.createdAt.slice(11, 16);

  return (
    <View style={styles.card}>
      <View style={styles.memberRow}>
        <View style={styles.avatar} />
        <Text style={styles.memberName}>{setlog.memberNickname}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
}
