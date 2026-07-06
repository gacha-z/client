import { Image, Text, View } from 'react-native';

import { Tag } from '@/components/Tag';
import { InfoRow } from '@/components/TravelPrimitives';
import { commonStyles } from '@/components/TravelPrimitives/index.css';
import type { MissionRecord } from '@/types';

import { styles } from './index.css';

type MissionCardProps = {
  mission: MissionRecord;
};

function TravelPhotoThumb({ photoUrl }: { photoUrl: string }) {
  return (
    <Image
      source={{ uri: photoUrl }}
      style={styles.thumbnail}
      resizeMode="cover"
      accessibilityIgnoresInvertColors
    />
  );
}

export function MissionCard({ mission }: MissionCardProps) {
  return (
    <View style={[commonStyles.card, styles.missionCard]}>
      <TravelPhotoThumb photoUrl={mission.photoUrl} />
      <View style={styles.missionContent}>
        <Text style={styles.missionTitle} numberOfLines={2}>
          {mission.title}
        </Text>
        <View style={styles.missionMeta}>
          <InfoRow icon="location">{mission.place}</InfoRow>
          <InfoRow icon="clock">{mission.successTime} 미션 성공</InfoRow>
        </View>
        <View style={styles.rewardTags}>
          {mission.collectedItems.map((item) => (
            <Tag
              key={item.name}
              icon={item.name === '아메리카노' ? 'coffee' : undefined}
              label={`${item.name} x ${item.count}`}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
