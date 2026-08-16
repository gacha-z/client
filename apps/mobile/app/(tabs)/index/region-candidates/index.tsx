import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';

import { completeTravelCreationAtom, travelCreationAtom } from '@travel-gacha/store';
import { Bigbutton } from '@/components/Bigbutton';
import { RegionCandidateList } from '@/components/RegionCandidateList';
import { ScreenLayout } from '@/components/ScreenLayout';
import { Toast } from '@/components/Toast';
import { REGION_CANDIDATE_MOCK, requestRegionCandidateRerollMock } from '@/mocks/regionCandidates';
import type { RegionCandidateSlot } from '@/types';
import { createRegionCandidateSlots, replaceRegionCandidateSlot } from '@/utils';

import { styles } from './index.css';

export default function RegionCandidatesScreen() {
  const router = useRouter();
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
  const dismissRerollError = useCallback(() => setRerollErrorVisible(false), []);

  useEffect(() => {
    if (!request) router.replace('/travel-create');
  }, [request, router]);

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
      const replacement = await requestRegionCandidateRerollMock(candidateSlots);

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

  const handleCreateTravel = () => {
    if (!selectedSlotId || !request || creatingTravelRef.current) return;

    const selectedSlot = candidateSlots.find(({ id }) => id === selectedSlotId);
    if (!selectedSlot) return;

    creatingTravelRef.current = true;
    setIsCreatingTravel(true);
    completeTravelCreation(selectedSlot.region);
    router.push('/travel-created');
  };

  if (!request) return null;

  return (
    <View style={styles.screen}>
      <ScreenLayout title="랜덤 지역 후보" headerActions showTopbar={false} scrollable>
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
            <RegionCandidateList
              items={candidateSlots}
              selectedId={selectedSlotId}
              onSelectionChange={setSelectedSlotId}
              onRetryItem={handleRetryCandidate}
              retryingId={rerollingSlotId}
            />
            <Bigbutton
              label="선택한 지역으로 여행 만들기"
              disabled={!selectedSlotId || !request}
              loading={isCreatingTravel}
              onPress={handleCreateTravel}
            />
          </View>
        </View>
      </ScreenLayout>
      <Toast
        visible={rerollErrorVisible}
        message="새로운 지역 후보를 불러오지 못했어요. 다시 시도해주세요."
        variant="error"
        onDismiss={dismissRerollError}
      />
    </View>
  );
}
