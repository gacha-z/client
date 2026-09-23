import { Pressable, Text, View } from 'react-native';

import type { SetlogEntry } from '@travel-gacha/types';
import { VideoThumbnail } from '@/components/VideoThumbnail';

import { styles } from './index.css';

type MissionLogCardProps = {
  setlog: SetlogEntry;
  onPress?: () => void;
};

export function MissionLogCard({ setlog, onPress }: MissionLogCardProps) {
  const time = setlog.createdAt.slice(11, 16);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.memberRow}>
        <View style={styles.avatar} />
        <Text style={styles.memberName}>{setlog.memberNickname}</Text>
      </View>
      <View style={styles.thumbnailWrap}>
        <VideoThumbnail uri={setlog.fileUrl} />
        <Text style={styles.thumbnailCaption}>{time}</Text>
      </View>
    </Pressable>
  );
}
