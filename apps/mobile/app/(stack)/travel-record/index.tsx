import { useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View, type ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  isApiError,
  leaveTrip,
  missionHistoryQueryOptions,
  tripDetailQueryOptions,
  tripInviteCodeQueryOptions,
  tripListRootKey,
  tripMembersQueryOptions,
  tripSetlogsQueryOptions
} from '@travel-gacha/api';
import { Modal } from '@/components/Modal';
import { ScreenLayout } from '@/components/ScreenLayout';
import { InfoRow, StatusBadge } from '@/components/TravelPrimitives';
import { getCachedMemberId } from '@/services/authSession';
import { buildTravelRecord, toTravelListItem } from '@/utils';

import { TravelRecord } from './components/TravelRecord';
import { styles } from './index.css';

const getParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default function TravelRecordScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tripId: tripIdParam } = useLocalSearchParams<{ tripId?: string }>();
  const tripId = getParam(tripIdParam) ?? '';
  const [leaveVisible, setLeaveVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const recordSectionY = useRef(0);
  const devMemberId = getCachedMemberId();
  const tripQuery = useQuery({
    ...tripDetailQueryOptions(tripId, devMemberId),
    enabled: Boolean(tripId) && Boolean(devMemberId)
  });
  const membersQuery = useQuery({
    ...tripMembersQueryOptions(tripId, devMemberId),
    enabled: Boolean(tripId) && Boolean(devMemberId)
  });
  const inviteCodeQuery = useQuery({
    ...tripInviteCodeQueryOptions(tripId, devMemberId),
    enabled: Boolean(tripId) && Boolean(devMemberId)
  });
  const missionHistoryQuery = useQuery({
    ...missionHistoryQueryOptions({ tripId, memberId: devMemberId }),
    enabled: Boolean(tripId)
  });
  const setlogsQuery = useQuery({
    ...tripSetlogsQueryOptions({ tripId, memberId: devMemberId }),
    enabled: Boolean(tripId)
  });
  const leaveMutation = useMutation({
    mutationFn: leaveTrip,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tripListRootKey });
      setLeaveVisible(false);
      router.replace('/travel');
    }
  });

  const trip = tripQuery.data;
  const isOwner = Boolean(
    trip && devMemberId !== undefined && trip.ownerMemberId === String(devMemberId)
  );
  const handleLeave = () => {
    if (!devMemberId || !tripId) return;
    leaveMutation.mutate({ tripId, memberId: devMemberId });
  };

  const handleCopyInviteCode = async () => {
    if (!inviteCodeQuery.data) return;
    await Clipboard.setStringAsync(inviteCodeQuery.data);
    setCopied(true);
  };

  if (!tripId) {
    return (
      <ScreenLayout title="여행 상세" showBack fallbackRoute="/travel">
        <View style={styles.state}>
          <Text style={styles.stateTitle}>여행을 찾을 수 없어요.</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (tripQuery.isPending) {
    return (
      <ScreenLayout title="여행 상세" showBack fallbackRoute="/travel">
        <ActivityIndicator style={styles.state} />
      </ScreenLayout>
    );
  }

  if (tripQuery.isError || !trip) {
    return (
      <ScreenLayout title="여행 상세" showBack fallbackRoute="/travel">
        <View style={styles.state}>
          <Text style={styles.stateTitle}>여행 정보를 불러오지 못했어요.</Text>
          <Text style={styles.stateDescription}>
            {isApiError(tripQuery.error) ? tripQuery.error.message : '잠시 후 다시 시도해주세요.'}
          </Text>
          <Pressable style={styles.retryButton} onPress={() => tripQuery.refetch()}>
            <Text style={styles.retryLabel}>다시 시도</Text>
          </Pressable>
        </View>
      </ScreenLayout>
    );
  }

  const cardTrip = toTravelListItem(trip);
  const missionTime = trip.missionStartAt.slice(11, 16);
  const travelRecord = buildTravelRecord({
    tripId: trip.id,
    title: trip.title,
    period: cardTrip.period,
    members: membersQuery.data?.map((member) => ({ id: member.id, name: member.name })) ?? [],
    missionHistory: missionHistoryQuery.data ?? [],
    setlogs: setlogsQuery.data ?? []
  });

  return (
    <ScreenLayout
      title="여행 상세"
      scrollable
      scrollViewRef={scrollViewRef}
      headerActions
      showBack
      fallbackRoute="/travel"
    >
      <View style={styles.content}>
        {trip.tripRegionImageUrl ? (
          <Image source={{ uri: trip.tripRegionImageUrl }} style={styles.regionImage} />
        ) : null}

        <View style={styles.titleRow}>
          <Text style={styles.title}>{trip.title}</Text>
          <StatusBadge status={cardTrip.status} />
        </View>

        <View style={styles.infoCard}>
          <InfoRow icon="calendar">
            {cardTrip.period.startDate} ~ {cardTrip.period.endDate} ({cardTrip.period.nights}박{' '}
            {cardTrip.period.days}일)
          </InfoRow>
          <InfoRow icon="location">{cardTrip.location}</InfoRow>
          <InfoRow icon="people">
            {trip.joinedMemberCount} / {trip.memberLimit}명
          </InfoRow>
          <InfoRow icon="clock">
            하루 {trip.missionMin}~{trip.missionMax}개 · 첫 미션 {missionTime}
          </InfoRow>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>여행 멤버</Text>
            {isOwner ? (
              <Pressable
                style={styles.manageButton}
                onPress={() =>
                  router.push({ pathname: '/travel-record/members', params: { tripId } })
                }
              >
                <Text style={styles.manageLabel}>관리</Text>
              </Pressable>
            ) : null}
          </View>
          {membersQuery.isPending ? <ActivityIndicator /> : null}
          {membersQuery.isError ? (
            <Text style={styles.stateDescription}>멤버를 불러오지 못했어요.</Text>
          ) : null}
          {membersQuery.data?.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role === 'OWNER' ? '방장' : '멤버'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>초대 코드</Text>
          <View style={styles.inviteRow}>
            <Text style={styles.inviteCode} numberOfLines={1}>
              {inviteCodeQuery.isPending
                ? '불러오는 중'
                : inviteCodeQuery.isError
                  ? '초대 코드를 불러오지 못했어요.'
                  : inviteCodeQuery.data}
            </Text>
            <Pressable
              style={styles.copyButton}
              disabled={!inviteCodeQuery.data}
              onPress={() => void handleCopyInviteCode()}
            >
              <Text style={styles.copyLabel}>{copied ? '복사됨' : '복사하기'}</Text>
            </Pressable>
          </View>
        </View>

        <View
          style={styles.recordSection}
          onLayout={(event) => {
            recordSectionY.current = event.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.sectionTitle}>여행 기록</Text>
          {missionHistoryQuery.isPending ? <ActivityIndicator /> : null}
          {missionHistoryQuery.isSuccess && !travelRecord ? (
            <Text style={styles.stateDescription}>아직 진행된 미션이 없어요.</Text>
          ) : null}
          <TravelRecord
            travel={travelRecord ?? undefined}
            onPressMissionLog={() =>
              scrollViewRef.current?.scrollTo({ y: recordSectionY.current, animated: true })
            }
            onPressDiary={() => router.push({ pathname: '/diary', params: { tripId } })}
          />
        </View>

        {!isOwner && trip.status === 'CREATED' ? (
          <Pressable style={styles.cancelButton} onPress={() => setLeaveVisible(true)}>
            <Text style={styles.cancelLabel}>여행 나가기</Text>
          </Pressable>
        ) : null}
      </View>

      <Modal
        visible={leaveVisible}
        title="여행에서 나가시겠어요?"
        onClose={() => setLeaveVisible(false)}
        onCancel={() => setLeaveVisible(false)}
        onConfirm={handleLeave}
        cancelText="돌아가기"
        confirmText="나가기"
        confirmVariant="danger"
        confirmLoading={leaveMutation.isPending}
        closeOnBackdropPress={!leaveMutation.isPending}
      >
        <Text style={styles.modalDescription}>
          나가면 이 여행방의 기록에 더 이상 접근할 수 없어요.
        </Text>
        {leaveMutation.isError ? (
          <Text style={styles.errorText}>
            {isApiError(leaveMutation.error)
              ? leaveMutation.error.message
              : '여행에서 나가지 못했어요.'}
          </Text>
        ) : null}
      </Modal>
    </ScreenLayout>
  );
}
