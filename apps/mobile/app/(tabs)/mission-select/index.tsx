// apps/mobile/app/(tabs)/mission-select/index.tsx
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, usePathname } from 'expo-router';
import * as Location from 'expo-location';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import {
  currentMemberQueryOptions,
  tripDetailQueryOptions,
  tripMembersQueryOptions
} from '@travel-gacha/api';
import { missionOutcomesAtom } from '@travel-gacha/store';
import type { TripMember } from '@travel-gacha/types';
import { colors } from '@travel-gacha/ui';
import { Bigbutton } from '@/components/Bigbutton';
import { MemberStatusPill } from '@/components/MemberStatusPill';
import { MissionSelectCard } from '@/components/MissionSelectCard';
import { Modal } from '@/components/Modal';
import { ProgressCard } from '@/components/ProgressCard';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TodayRecordSection } from '@/components/TodayRecordSection';
import { TripStatusBar } from '@/components/TripStatusBar';
import { useTodayMission } from '@/hooks';

import { styles } from './index.css';

/** dayNo를 기준으로 한 명을 "오늘의 미션 선택자"로 표시한다 (클라이언트 전용 cosmetic 배지) */
function withMissionPicker(members: TripMember[], dayNo: number): TripMember[] {
  if (members.length === 0) return members;
  const pickerIndex = dayNo % members.length;
  return members.map((member, index) => ({ ...member, isMissionPicker: index === pickerIndex }));
}

export default function MissionSelectScreen() {
  const { tripId: tripIdParam } = useLocalSearchParams<{ tripId?: string }>();
  const tripId = tripIdParam ?? process.env.EXPO_PUBLIC_DEV_TRIP_ID ?? '';
  // RN Modal은 앱 전역에 뜨므로, 이 탭이 화면 맨 위일 때만 클리어 모달을 띄운다.
  const pathname = usePathname();
  const isTabFocused = pathname === '/mission-select';
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const memberQuery = useQuery(currentMemberQueryOptions());
  const tripQuery = useQuery({ ...tripDetailQueryOptions(tripId), enabled: Boolean(tripId) });
  const membersQuery = useQuery({ ...tripMembersQueryOptions(tripId), enabled: Boolean(tripId) });
  const outcomes = useAtomValue(missionOutcomesAtom);

  const mission = useTodayMission({
    tripId,
    memberId: memberQuery.data?.id ?? null,
    totalMemberCount: membersQuery.data?.length ?? 0
  });

  if (!tripId) {
    return (
      <ScreenLayout title="미션 선택" showTopbar={false} headerActions scrollable>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>여행 정보를 불러올 수 없어요</Text>
          <Text style={styles.sectionHint}>여행 목록에서 진행 중인 여행을 먼저 선택해주세요.</Text>
        </View>
      </ScreenLayout>
    );
  }

  const members = withMissionPicker(membersQuery.data ?? [], mission.dayNo);
  const isIdle = mission.stage === 'idle';
  const isSelecting = mission.stage === 'selecting';
  const isPending = mission.stage === 'pending';

  const handleConfirmSelection = () => {
    if (!mission.candidates.some((candidate) => candidate.id === selectedId)) return;
    mission.select(selectedId as string);
    setSelectedId(null);
  };

  const handleComplete = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('오류', '위치 권한이 필요해요. 설정에서 위치 접근을 허용해주세요.');
      return;
    }

    try {
      const position = await Location.getCurrentPositionAsync({});
      mission.complete({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    } catch {
      Alert.alert('오류', '현재 위치를 가져오지 못했어요. 다시 시도해주세요.');
    }
  };

  return (
    <ScreenLayout title="미션 선택" showTopbar={false} headerActions scrollable>
      <View style={styles.content}>
        <TripStatusBar
          tripName={tripQuery.data?.title ?? ''}
          day={mission.dayNo}
          showMore={isIdle}
          onPressMore={() => {}}
        />
        <ProgressCard
          completed={mission.completedCount}
          total={mission.totalCount}
          statusLabel="미션 완료"
          members={members}
          segmented
          outcomes={outcomes}
        />
        {isPending && mission.selectedMission ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>오늘의 랜덤 미션</Text>
            <Text style={styles.sectionHint}>
              멤버 모두가 미션로그를 촬영해야 미션 완료가 가능해요!
            </Text>
            <View style={styles.pendingRow}>
              <MissionSelectCard
                title={mission.selectedMission.title}
                description={mission.selectedMission.description}
                missionType={mission.selectedMission.missionType}
                difficulty={mission.selectedMission.difficulty}
                status="inProgress"
              />
              <View style={styles.pillList}>
                {members.map((member) => {
                  const verified = mission.verifiedMemberIds.includes(member.id);
                  return (
                    <MemberStatusPill
                      key={member.id}
                      name={member.name}
                      statusLabel={verified ? '미션 인증' : '미션 미인증'}
                      variant={verified ? 'verified' : 'unverified'}
                    />
                  );
                })}
              </View>
            </View>
            <Bigbutton
              label="미션 완료"
              disabled={!mission.allVerified || mission.isCompleting}
              onPress={handleComplete}
            />
            <Pressable onPress={() => mission.fail()}>
              <Text style={styles.giveUpText}>
                미션이 너무 어려워서 포기하고 싶다구요?! 미션 포기하기
              </Text>
            </Pressable>
          </View>
        ) : isSelecting ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>오늘의 랜덤 미션</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.carousel}>
                {mission.candidates.map((candidate) => (
                  <Pressable key={candidate.id} onPress={() => setSelectedId(candidate.id)}>
                    <MissionSelectCard
                      title={candidate.title}
                      description={candidate.description}
                      missionType={candidate.missionType}
                      difficulty={candidate.difficulty}
                      status={selectedId === candidate.id ? 'active' : 'default'}
                      onRetry={() => {
                        mission.reroll(candidate.id);
                        if (selectedId === candidate.id) setSelectedId(null);
                      }}
                    />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
            <Bigbutton
              label="미션 선택하기"
              disabled={!mission.candidates.some((candidate) => candidate.id === selectedId)}
              onPress={handleConfirmSelection}
            />
          </View>
        ) : (
          <View style={styles.section}>
            {mission.limitReached ? (
              <>
                <Text style={styles.sectionTitle}>오늘의 미션을 모두 완료했어요!</Text>
                <Text style={styles.sectionHint}>
                  오늘 도전 가능한 미션이 모두 끝났어요. 내일 새로운 랜덤 미션을 기대해주세요!
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>오늘의 랜덤 미션</Text>
                <Text style={styles.sectionHint}>미션이 곧 시작돼요. 잠시만 기다려주세요!</Text>
              </>
            )}
          </View>
        )}
        <TodayRecordSection />
      </View>
      <Modal
        visible={isPending && mission.allVerified && isTabFocused}
        onClose={handleComplete}
        title="미션을 클리어했어요!"
        titleColor={colors.slateDark}
        onConfirm={handleComplete}
        confirmText="미션 완료"
        confirmButtonColor={colors.cyan500}
        closeOnBackdropPress={false}
      >
        <Text style={styles.modalBody}>
          축하합니다 🎉🎉{'\n'}아이템 획득 후, 새로운 미션에 도전해보아요!
        </Text>
      </Modal>
    </ScreenLayout>
  );
}
