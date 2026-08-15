import { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Bigbutton } from '@/components/Bigbutton';
import { RandomIcon } from '@/components/icons';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TravelCard } from '@/components/TravelCard';
import { TravelScheduleCalendar } from '@/components/TravelScheduleCalendar';
import { TRAVEL_LIST_MOCK } from '@/constants';
import { toDateKey } from '@/utils';

import { styles } from './index.css';

export default function HomeScreen() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const scheduledTrips = TRAVEL_LIST_MOCK.filter((trip) => trip.status === 'scheduled');

  const handleRangeChange = (nextStartDate: Date | null, nextEndDate: Date | null) => {
    setStartDate(nextStartDate);
    setEndDate(nextEndDate);
  };

  const handleStartRandomTravel = () => {
    if (!startDate || !endDate) return;

    router.push({
      pathname: '/travel-create',
      params: {
        startDate: toDateKey(startDate),
        endDate: toDateKey(endDate)
      }
    });
  };

  return (
    <ScreenLayout title="홈" headerActions showTopbar={false} scrollable>
      <View style={styles.content}>
        <Text style={styles.heading}>나만의 여행 랜덤 코스를 만들어봐요!</Text>
        <TravelScheduleCalendar onRangeChange={handleRangeChange} />
        <Bigbutton
          label="랜덤 여행 시작하기"
          icon={<RandomIcon />}
          disabled={!startDate || !endDate}
          onPress={handleStartRandomTravel}
        />
        <View style={styles.scheduledSection}>
          <Text style={styles.sectionTitle}>예정된 여행</Text>
          <View style={styles.tripList}>
            {scheduledTrips.map((trip) => (
              <TravelCard key={trip.id} trip={trip} />
            ))}
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
}
