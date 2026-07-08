import { ScreenLayout } from '@/components/ScreenLayout';
import { TRAVEL_RECORD_MOCK } from '@/constants';

import { TravelRecord } from './components/TravelRecord';

export default function TravelRecordScreen() {
  return (
    <ScreenLayout title="여행 기록" scrollable headerActions showBack fallbackRoute="/travel">
      <TravelRecord travel={TRAVEL_RECORD_MOCK} />
    </ScreenLayout>
  );
}
