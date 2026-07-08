import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { InfoRow, PillButton, StatusBadge } from '@/components/TravelPrimitives';
import { commonStyles } from '@/components/TravelPrimitives/index.css';
import type { TravelListItem } from '@/types';
import { formatCollectionItems, formatTravelMembers, formatTravelPeriod } from '@/utils';

import { styles } from './index.css';

export function TravelCard({ trip }: { trip: TravelListItem }) {
  const router = useRouter();
  const actionLabel = trip.status === 'scheduled' ? '수정하기' : '자세히보기';
  const actionDisabled = trip.status === 'scheduled';

  return (
    <View style={[commonStyles.card, styles.card]}>
      <View style={styles.cardHeader}>
        <Text style={styles.tripTitle} numberOfLines={1}>
          {trip.title}
        </Text>
        <StatusBadge status={trip.status} />
      </View>
      <View style={styles.infoBlock}>
        <InfoRow icon="calendar">{formatTravelPeriod(trip.period)}</InfoRow>
        <InfoRow icon="location">{trip.location}</InfoRow>
        <InfoRow icon="people">{formatTravelMembers(trip.members)}</InfoRow>
        <InfoRow icon="items">{formatCollectionItems(trip.items)}</InfoRow>
      </View>
      <View style={styles.cardFooter}>
        <PillButton
          label={actionLabel}
          disabled={actionDisabled}
          onPress={() =>
            router.push({
              pathname: '/travel-record'
            })
          }
        />
      </View>
    </View>
  );
}
