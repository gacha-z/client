import { Text, View } from 'react-native';

import { styles } from './index.css';

type CollectionSummaryProps = {
  title: string;
  unlockedCount: number;
  totalCount: number;
};

export function CollectionSummary({ title, unlockedCount, totalCount }: CollectionSummaryProps) {
  const ratio = totalCount === 0 ? 0 : Math.min(unlockedCount / totalCount, 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.countRow}>
          <Text style={styles.count}>{unlockedCount}</Text>
          <Text style={styles.total}> / {totalCount}</Text>
        </View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
      </View>
      <Text style={styles.caption}>여행을 계속하며 새로운 도감을 모아보세요.</Text>
    </View>
  );
}
