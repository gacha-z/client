import { View } from 'react-native';

import { ScreenLayout } from '@/components/ScreenLayout';
import { TravelCard } from '@/components/TravelCard';
import { TRAVEL_LIST_MOCK } from '@/constants';

import { styles } from './index.css';
import { TravelListToolbar } from './components';

export default function TravelListScreen() {
  return (
    <ScreenLayout title="여행 목록" scrollable headerActions showBack={false}>
      <TravelListToolbar />
      <View style={styles.list}>
        {TRAVEL_LIST_MOCK.map((trip) => (
          <TravelCard key={trip.id} trip={trip} />
        ))}
      </View>
    </ScreenLayout>
  );
}
