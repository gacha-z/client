import { useRouter } from 'expo-router';

import { ScreenLayout } from '@/components/ScreenLayout';
import { TRAVEL_RECORD_MOCK } from '@/constants';

import { TravelRecord } from './components/TravelRecord';

export default function TravelRecordScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/travel');
  };

  return (
    <ScreenLayout title="여행 기록" scrollable headerActions showBack onPressBack={handleBack}>
      <TravelRecord travel={TRAVEL_RECORD_MOCK} />
    </ScreenLayout>
  );
}
