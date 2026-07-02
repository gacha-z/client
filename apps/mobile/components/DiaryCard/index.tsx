import { Image, Pressable, Text, View } from 'react-native';

import { styles } from './index.css';

type DiaryCardProps = {
  authorName: string;
  title: string;
  body: string;
  dateTime: string;
  avatarUri?: string;
  onPress?: () => void;
};

/** 일기 카드 (④ 일기쓰기 모달 리스트, ⑥ 여행 일기장) */
export function DiaryCard({
  authorName,
  title,
  body,
  dateTime,
  avatarUri,
  onPress
}: DiaryCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.authorRow}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <Text style={styles.authorName}>{authorName}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body} numberOfLines={2}>
          {body}
        </Text>
      </View>
      <Text style={styles.dateTime}>{dateTime}</Text>
    </Pressable>
  );
}
