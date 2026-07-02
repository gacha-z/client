import { Image, Pressable, Text, View } from 'react-native';

import { styles } from './index.css';

type PhotoTargetCardProps = {
  name: string;
  time: string;
  avatarUri?: string;
  ready?: boolean;
  onPress?: () => void;
};

/** 미션로그 촬영 대상 카드 (⑪ 촬영 대상 리스트) */
export function PhotoTargetCard({ name, time, avatarUri, ready, onPress }: PhotoTargetCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress} disabled={!ready}>
      <View style={styles.header}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <Text style={styles.name}>{name}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
      {ready && (
        <View style={styles.readyBadge}>
          <Text style={styles.readyText}>눌러서 촬영</Text>
        </View>
      )}
    </Pressable>
  );
}
