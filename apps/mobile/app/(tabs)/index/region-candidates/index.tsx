import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  isApiError,
  randomTripRegionsQueryOptions,
  rerollTripRegion,
  selectTripRegion,
  tripDetailQueryKey,
  tripListRootKey
} from '@travel-gacha/api';
import { completeTravelCreationAtom, travelCreationAtom } from '@travel-gacha/store';
import { Bigbutton } from '@/components/Bigbutton';
import { RegionCandidateList } from '@/components/RegionCandidateList';
import { ScreenLayout } from '@/components/ScreenLayout';
import { Toast } from '@/components/Toast';
import { REGION_CANDIDATE_MOCK, requestRegionCandidateRerollMock } from '@/mocks/regionCandidates';
import { getDevMemberId } from '@/services/authSession';
import type { RegionCandidateSlot } from '@/types';
import { createRegionCandidateSlots, replaceRegionCandidateSlot } from '@/utils';

import { styles } from './index.css';

export default function RegionCandidatesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const devMemberId = getDevMemberId();
  const travelCreation = useAtomValue(travelCreationAtom);
  const completeTravelCreation = useSetAtom(completeTravelCreationAtom);
  const [candidateSlots, setCandidateSlots] = useState(() =>
    createRegionCandidateSlots(REGION_CANDIDATE_MOCK)
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [rerollingSlotId, setRerollingSlotId] = useState<string | null>(null);
  const [isCreatingTravel, setIsCreatingTravel] = useState(false);
  const [rerollErrorVisible, setRerollErrorVisible] = useState(false);
  const rerollingSlotIdRef = useRef<string | null>(null);
  const rerolledSlotIdsRef = useRef(new Set<string>());
  const creatingTravelRef = useRef(false);
  const request = travelCreation.step === 'form' ? null : travelCreation.request;
  const tripId = travelCreation.step === 'form' ? '' : travelCreation.tripId;
  const dismissRerollError = useCallback(() => setRerollErrorVisible(false), []);
  const regionsQuery = useQuery({
    ...randomTripRegionsQueryOptions(tripId, devMemberId),
    enabled: Boolean(tripId) && Boolean(devMemberId)
  });
  const rerollMutation = useMutation({ mutationFn: rerollTripRegion });
  const selectMutation = useMutation({ mutationFn: selectTripRegion });

  useEffect(() => {
    if (!request || !tripId) router.replace('/travel-create');
  }, [request, router, tripId]);

  useEffect(() => {
    if (regionsQuery.data) {
      setCandidateSlots(createRegionCandidateSlots(regionsQuery.data));
    }
  }, [regionsQuery.data]);

  useFocusEffect(
    useCallback(() => {
      creatingTravelRef.current = false;
      setIsCreatingTravel(false);
    }, [])
  );

  const handleRetryCandidate = async (slot: RegionCandidateSlot) => {
    if (slot.rerollUsed || rerolledSlotIdsRef.current.has(slot.id) || rerollingSlotIdRef.current) {
      return;
    }

    rerollingSlotIdRef.current = slot.id;
    setRerollingSlotId(slot.id);

    try {
      const replacement =
        slot.region.candidateId && devMemberId
          ? await rerollMutation.mutateAsync({
              tripId,
              tripCandidateId: slot.region.candidateId,
              memberId: devMemberId
            })
          : await requestRegionCandidateRerollMock(candidateSlots);

      rerolledSlotIdsRef.current.add(slot.id);
      setCandidateSlots((current) => replaceRegionCandidateSlot(current, slot.id, replacement));
      if (selectedSlotId === slot.id) setSelectedSlotId(null);
    } catch {
      setRerollErrorVisible(true);
    } finally {
      rerollingSlotIdRef.current = null;
      setRerollingSlotId(null);
    }
  };

  const handleCreateTravel = async () => {
    if (!selectedSlotId || !request || !tripId || creatingTravelRef.current) return;

    const selectedSlot = candidateSlots.find(({ id }) => id === selectedSlotId);
    if (!selectedSlot || !Number.isInteger(Number(selectedSlot.region.id))) return;

    if (!devMemberId) return;

    creatingTravelRef.current = true;
    setIsCreatingTravel(true);
    try {
      await selectMutation.mutateAsync({
        tripId,
        tripRegionId: selectedSlot.region.id,
        memberId: devMemberId
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: tripListRootKey }),
        queryClient.invalidateQueries({ queryKey: tripDetailQueryKey(tripId) })
      ]);
      completeTravelCreation(selectedSlot.region);
      router.push('/travel-created');
    } catch {
      setRerollErrorVisible(true);
      creatingTravelRef.current = false;
      setIsCreatingTravel(false);
    }
  };

  if (!request) return null;

  const selectedSlot = candidateSlots.find(({ id }) => id === selectedSlotId);
  const canSelectRegion = Boolean(
    regionsQuery.isSuccess && selectedSlot && Number.isInteger(Number(selectedSlot.region.id))
  );

  return (
    <View style={styles.screen}>
      <ScreenLayout title="랜덤 지역 후보" headerActions showBack fallbackRoute="/" scrollable>
        <View style={styles.content}>
          <View style={styles.notice}>
            <View style={styles.noticeCircleLarge} />
            <View style={styles.noticeCircleSmall} />
            <Text style={styles.noticeTitle}>랜덤 지역 3곳이 도착했어요!</Text>
            <Text style={styles.noticeDescription}>
              마음에 드는 지역을 1곳 선택해주세요. 마음에 들지 않는 카드는 다시 뽑을 수 있어요.
            </Text>
          </View>

          <View style={styles.candidateSection}>
            <Text style={styles.heading}>랜덤 지역 후보</Text>
            <Text style={styles.description}>3가지의 후보 중 1개를 선택하세요!</Text>
            {regionsQuery.isPending && <ActivityIndicator />}
            {regionsQuery.isError && (
              <View style={styles.state}>
                <Text style={styles.errorText}>
                  {isApiError(regionsQuery.error)
                    ? regionsQuery.error.message
                    : '추천 지역을 불러오지 못했어요.'}
                </Text>
                <Pressable style={styles.retryButton} onPress={() => regionsQuery.refetch()}>
                  <Text style={styles.retryLabel}>다시 시도</Text>
                </Pressable>
              </View>
            )}
            <RegionCandidateList
              items={candidateSlots}
              selectedId={selectedSlotId}
              onSelectionChange={setSelectedSlotId}
              onRetryItem={handleRetryCandidate}
              retryingId={rerollingSlotId}
            />
            <Bigbutton
              label="선택한 지역으로 여행 만들기"
              disabled={!canSelectRegion}
              loading={isCreatingTravel}
              onPress={() => void handleCreateTravel()}
            />
          </View>
        </View>
      </ScreenLayout>
      <Toast
        visible={rerollErrorVisible}
        message="요청을 처리하지 못했어요. 다시 시도해주세요."
        variant="error"
        onDismiss={dismissRerollError}
      />
    </View>
  );
}
