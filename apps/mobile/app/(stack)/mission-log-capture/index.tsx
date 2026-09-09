import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import {
  missionSetlogsQueryOptions,
  tripDetailQueryOptions,
  tripMembersQueryOptions
} from '@travel-gacha/api';
import { activeMissionAtom } from '@travel-gacha/store';
import { PhotoTargetCard } from '@/components/PhotoTargetCard';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TripStatusBar } from '@/components/TripStatusBar';

import { styles } from './index.css';

export default function MissionLogCaptureListScreen() {
  const { tripId: tripIdParam } = useLocalSearchParams<{ tripId?: string }>();
  const tripId = tripIdParam ?? process.env.EXPO_PUBLIC_DEV_TRIP_ID ?? '';
  const router = useRouter();
  const activeMission = useAtomValue(activeMissionAtom);

  const tripQuery = useQuery({ ...tripDetailQueryOptions(tripId), enabled: Boolean(tripId) });
  const membersQuery = useQuery({ ...tripMembersQueryOptions(tripId), enabled: Boolean(tripId) });
  const setlogsQuery = useQuery({
    ...missionSetlogsQueryOptions(activeMission?.tripMissionId ?? ''),
    enabled: Boolean(activeMission)
  });

  const members = membersQuery.data ?? [];
  const verifiedMemberIds = (setlogsQuery.data ?? []).map((entry) => entry.memberId);

  return (
    <ScreenLayout title="미션로그 촬영하기" showBack headerActions scrollable>
      <View style={styles.content}>
        {/* dayNo는 이 화면에서 별도로 조회하지 않는다 — mission-select에서 넘어오는 경로이므로 1로 고정 */}
        <TripStatusBar tripName={tripQuery.data?.title ?? ''} day={1} />
        {members.map((member, index) => {
          const isVerified = verifiedMemberIds.includes(member.id);
          const priorMembersVerified = members
            .slice(0, index)
            .every((prior) => verifiedMemberIds.includes(prior.id));
          const isReadyToCapture = !isVerified && priorMembersVerified;

          return (
            <PhotoTargetCard
              key={member.id}
              name={member.name}
              time={isVerified ? '촬영완료' : '09:00'}
              ready={isReadyToCapture}
              onPress={() => router.push(`/mission-log-capture/${member.id}?tripId=${tripId}`)}
            />
          );
        })}
      </View>
    </ScreenLayout>
  );
}
