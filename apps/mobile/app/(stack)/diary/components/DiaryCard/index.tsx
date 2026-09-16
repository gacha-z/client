import { Text, View } from 'react-native';

import type { DiaryEntry } from '@travel-gacha/types';

import { styles } from './index.css';

type DiaryCardProps = {
  diary: DiaryEntry;
};

export function DiaryCard({ diary }: DiaryCardProps) {
  const createdAt = diary.createdAt.replace('T', ' ').slice(0, 16);

  return (
    <View style={styles.card}>
      <View style={styles.authorRow}>
        <View style={styles.avatar} />
        <Text style={styles.authorName}>{diary.memberNickname}</Text>
      </View>
      <Text style={styles.content} numberOfLines={3}>
        {diary.content}
      </Text>
      <Text style={styles.createdAt}>{createdAt}</Text>
    </View>
  );
}
