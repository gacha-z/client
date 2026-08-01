import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';

import { MOCK_MEMBERS, MOCK_TRIP, memberVerificationsAtom } from '@travel-gacha/store';
import { PhotoTargetCard } from '@/components/PhotoTargetCard';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TripStatusBar } from '@/components/TripStatusBar';

import { styles } from './index.css';

export default function MissionLogCaptureListScreen() {
  const router = useRouter();
  const verifications = useAtomValue(memberVerificationsAtom);

  return (
    <ScreenLayout title="미션로그 촬영하기" showBack headerActions scrollable>
      <View style={styles.content}>
        <TripStatusBar tripName={MOCK_TRIP.name} day={MOCK_TRIP.day} />
        {MOCK_MEMBERS.map((member, index) => {
          const isVerified = verifications[member.id] === 'verified';
          const priorMembersVerified = MOCK_MEMBERS.slice(0, index).every(
            (prior) => verifications[prior.id] === 'verified'
          );
          const isReadyToCapture = !isVerified && priorMembersVerified;

          return (
            <PhotoTargetCard
              key={member.id}
              name={member.name}
              time={isVerified ? '촬영완료' : '09:00'}
              ready={isReadyToCapture}
              onPress={() => router.push(`/mission-log-capture/${member.id}`)}
            />
          );
        })}
      </View>
    </ScreenLayout>
  );
}
