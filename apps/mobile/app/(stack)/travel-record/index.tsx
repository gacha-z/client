import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  cancelTrip,
  isApiError,
  leaveTrip,
  missionHistoryQueryOptions,
  tripDetailQueryKey,
  tripDetailQueryOptions,
  tripInviteCodeQueryOptions,
  tripListRootKey,
  tripMembersQueryOptions,
  tripSetlogsQueryOptions
} from '@travel-gacha/api';
import { Modal } from '@/components/Modal';
import { ScreenLayout } from '@/components/ScreenLayout';
import { InfoRow, StatusBadge } from '@/components/TravelPrimitives';
import { getDevMemberId } from '@/services/authSession';
import { buildTravelRecord, toDateKey, toTravelListItem } from '@/utils';

import { TravelRecord } from './components/TravelRecord';
import { styles } from './index.css';

const getParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default function TravelRecordScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tripId: tripIdParam } = useLocalSearchParams<{ tripId?: string }>();
  const tripId = getParam(tripIdParam) ?? '';
  const [cancelVisible, setCancelVisible] = useState(false);
  const [leaveVisible, setLeaveVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const devMemberId = getDevMemberId();
  const tripQuery = useQuery({ ...tripDetailQueryOptions(tripId), enabled: Boolean(tripId) });
  const membersQuery = useQuery({ ...tripMembersQueryOptions(tripId), enabled: Boolean(tripId) });
  const inviteCodeQuery = useQuery({
    ...tripInviteCodeQueryOptions(tripId),
    enabled: Boolean(tripId)
  });
  const missionHistoryQuery = useQuery({
    ...missionHistoryQueryOptions({ tripId, memberId: devMemberId }),
    enabled: Boolean(tripId)
  });
  const setlogsQuery = useQuery({
    ...tripSetlogsQueryOptions({ tripId, memberId: devMemberId }),
    enabled: Boolean(tripId)
  });
  const cancelMutation = useMutation({
    mutationFn: cancelTrip,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: tripListRootKey }),
        queryClient.invalidateQueries({ queryKey: tripDetailQueryKey(tripId) })
      ]);
      setCancelVisible(false);
      router.replace('/travel');
    }
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
  const isBeforeTripStart = Boolean(trip && toDateKey(new Date()) < trip.startDate);

  const handleCancel = () => {
    if (!devMemberId || !tripId) return;
    cancelMutation.mutate({ tripId, requestMemberId: devMemberId });
  };

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
    <ScreenLayout title="여행 상세" scrollable headerActions showBack fallbackRoute="/travel">
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
            {isOwner && !isBeforeTripStart ? (
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

        <View style={styles.recordSection}>
          <Text style={styles.sectionTitle}>여행 기록</Text>
          {missionHistoryQuery.isPending ? <ActivityIndicator /> : null}
          {missionHistoryQuery.isSuccess && !travelRecord ? (
            <Text style={styles.stateDescription}>아직 진행된 미션이 없어요.</Text>
          ) : null}
          <TravelRecord travel={travelRecord ?? undefined} />
        </View>

        {isOwner && trip.status === 'CREATED' ? (
          <Pressable style={styles.cancelButton} onPress={() => setCancelVisible(true)}>
            <Text style={styles.cancelLabel}>여행 취소하기</Text>
          </Pressable>
        ) : null}

        {!isOwner && trip.status === 'CREATED' ? (
          <Pressable style={styles.cancelButton} onPress={() => setLeaveVisible(true)}>
            <Text style={styles.cancelLabel}>여행 나가기</Text>
          </Pressable>
        ) : null}
      </View>

      <Modal
        visible={cancelVisible}
        title="여행을 취소하시겠어요?"
        onClose={() => setCancelVisible(false)}
        onCancel={() => setCancelVisible(false)}
        onConfirm={handleCancel}
        cancelText="돌아가기"
        confirmText="여행 취소"
        confirmVariant="danger"
        confirmLoading={cancelMutation.isPending}
        closeOnBackdropPress={!cancelMutation.isPending}
      >
        <Text style={styles.modalDescription}>
          취소된 여행의 멤버와 기록은 보존되지만 다시 참여할 수 없어요.
        </Text>
        {cancelMutation.isError ? (
          <Text style={styles.errorText}>
            {isApiError(cancelMutation.error)
              ? cancelMutation.error.message
              : '여행을 취소하지 못했어요.'}
          </Text>
        ) : null}
      </Modal>

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
