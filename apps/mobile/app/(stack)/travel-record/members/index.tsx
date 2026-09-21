import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  cancelTrip,
  isApiError,
  kickTripMember,
  transferTripOwner,
  tripDetailQueryKey,
  tripDetailQueryOptions,
  tripListRootKey,
  tripMembersQueryKey,
  tripMembersQueryOptions,
  updateTrip
} from '@travel-gacha/api';
import type { TripMember } from '@travel-gacha/types';
import { Modal } from '@/components/Modal';
import { ScreenLayout } from '@/components/ScreenLayout';
import { getCachedMemberId } from '@/services/authSession';

import { TripEditModal, type TripEditFormValues } from './components/TripEditModal';
import { styles } from './index.css';

const getParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default function TravelRecordMembersScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tripId: tripIdParam } = useLocalSearchParams<{ tripId?: string }>();
  const tripId = getParam(tripIdParam) ?? '';
  const memberId = getCachedMemberId();

  const [editVisible, setEditVisible] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [kickTarget, setKickTarget] = useState<TripMember | null>(null);
  const [transferTarget, setTransferTarget] = useState<TripMember | null>(null);

  const tripQuery = useQuery({
    ...tripDetailQueryOptions(tripId, memberId),
    enabled: Boolean(tripId) && Boolean(memberId)
  });
  const membersQuery = useQuery({
    ...tripMembersQueryOptions(tripId, memberId),
    enabled: Boolean(tripId) && Boolean(memberId)
  });

  const invalidateTrip = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: tripDetailQueryKey(tripId) }),
      queryClient.invalidateQueries({ queryKey: tripMembersQueryKey(tripId) })
    ]);

  const updateMutation = useMutation({
    mutationFn: updateTrip,
    onSuccess: async () => {
      await invalidateTrip();
      setEditVisible(false);
    },
    onError: (error) => {
      Alert.alert(
        '여행 정보 수정 실패',
        isApiError(error) ? error.message : '잠시 후 다시 시도해주세요.'
      );
    }
  });

  const kickMutation = useMutation({
    mutationFn: kickTripMember,
    onSuccess: async () => {
      await invalidateTrip();
      setKickTarget(null);
    },
    onError: (error) => {
      Alert.alert('강퇴 실패', isApiError(error) ? error.message : '잠시 후 다시 시도해주세요.');
    }
  });

  const transferMutation = useMutation({
    mutationFn: transferTripOwner,
    onSuccess: async () => {
      await invalidateTrip();
      setTransferTarget(null);
      router.back();
    },
    onError: (error) => {
      Alert.alert(
        '방장 위임 실패',
        isApiError(error) ? error.message : '잠시 후 다시 시도해주세요.'
      );
    }
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
    },
    onError: (error) => {
      Alert.alert(
        '여행 취소 실패',
        isApiError(error) ? error.message : '잠시 후 다시 시도해주세요.'
      );
    }
  });

  const trip = tripQuery.data;
  const isOwner = Boolean(
    trip && memberId !== undefined && trip.ownerMemberId === String(memberId)
  );

  const handleCancelTrip = () => {
    if (!memberId || !tripId) return;
    cancelMutation.mutate({ tripId, requestMemberId: memberId });
  };

  const handleSaveTrip = (values: TripEditFormValues) => {
    if (!memberId || !tripId) return;
    const [missionStartHour, missionStartMinute] = values.missionStartTime.split(':').map(Number);
    updateMutation.mutate({
      tripId,
      memberId,
      title: values.title.trim(),
      startDate: values.startDate,
      endDate: values.endDate,
      memberLimit: Number(values.memberLimit),
      missionMin: Number(values.missionMin),
      missionMax: Number(values.missionMax),
      missionStartHour,
      missionStartMinute
    });
  };

  if (!tripId || tripQuery.isError || (tripQuery.isSuccess && !isOwner)) {
    return (
      <ScreenLayout title="여행 관리" showBack fallbackRoute="/travel">
        <View style={styles.state}>
          <Text style={styles.stateTitle}>
            {!tripId
              ? '여행을 찾을 수 없어요.'
              : !isOwner
                ? '방장만 접근할 수 있어요.'
                : '여행 정보를 불러오지 못했어요.'}
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  if (tripQuery.isPending || !trip) {
    return (
      <ScreenLayout title="여행 관리" showBack fallbackRoute="/travel">
        <ActivityIndicator style={styles.state} />
      </ScreenLayout>
    );
  }

  const otherMembers = (membersQuery.data ?? []).filter((member) => member.role !== 'OWNER');

  return (
    <ScreenLayout title="여행 관리" scrollable showBack fallbackRoute="/travel-record">
      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>여행 정보</Text>
            <Pressable style={styles.editButton} onPress={() => setEditVisible(true)}>
              <Text style={styles.editLabel}>수정</Text>
            </Pressable>
          </View>
          <Text style={styles.tripTitle}>{trip.title}</Text>
          <Text style={styles.tripMeta}>
            {trip.startDate} ~ {trip.endDate}
          </Text>
          <Text style={styles.tripMeta}>
            정원 {trip.joinedMemberCount} / {trip.memberLimit}명
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>멤버 관리</Text>
          {membersQuery.isPending ? <ActivityIndicator /> : null}
          {otherMembers.length === 0 ? (
            <Text style={styles.emptyText}>강퇴하거나 방장을 위임할 멤버가 없어요.</Text>
          ) : null}
          {otherMembers.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <Text style={styles.memberName}>{member.name}</Text>
              <View style={styles.memberActions}>
                <Pressable style={styles.transferButton} onPress={() => setTransferTarget(member)}>
                  <Text style={styles.transferLabel}>방장 위임</Text>
                </Pressable>
                <Pressable style={styles.kickButton} onPress={() => setKickTarget(member)}>
                  <Text style={styles.kickLabel}>강퇴</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>여행 취소</Text>
          {trip.status === 'CREATED' ? (
            <Pressable style={styles.cancelButton} onPress={() => setCancelVisible(true)}>
              <Text style={styles.cancelLabel}>여행 취소하기</Text>
            </Pressable>
          ) : (
            <Text style={styles.emptyText}>이미 종료되었거나 취소된 여행이에요.</Text>
          )}
        </View>
      </View>

      <TripEditModal
        visible={editVisible}
        trip={trip}
        loading={updateMutation.isPending}
        onClose={() => setEditVisible(false)}
        onSave={handleSaveTrip}
      />

      <Modal
        visible={Boolean(kickTarget)}
        title={`${kickTarget?.name ?? ''}님을 강퇴하시겠어요?`}
        onClose={() => setKickTarget(null)}
        onCancel={() => setKickTarget(null)}
        onConfirm={() => {
          if (!memberId || !kickTarget) return;
          kickMutation.mutate({ tripId, targetMemberId: kickTarget.id, memberId });
        }}
        cancelText="돌아가기"
        confirmText="강퇴"
        confirmVariant="danger"
        confirmLoading={kickMutation.isPending}
        closeOnBackdropPress={!kickMutation.isPending}
      >
        <Text style={styles.modalDescription}>
          강퇴된 멤버는 초대 코드로 다시 참여할 수 있어요.
        </Text>
      </Modal>

      <Modal
        visible={Boolean(transferTarget)}
        title={`${transferTarget?.name ?? ''}님에게 방장을 위임하시겠어요?`}
        onClose={() => setTransferTarget(null)}
        onCancel={() => setTransferTarget(null)}
        onConfirm={() => {
          if (!memberId || !transferTarget) return;
          transferMutation.mutate({
            tripId,
            newOwnerMemberId: transferTarget.id,
            memberId
          });
        }}
        cancelText="돌아가기"
        confirmText="위임하기"
        confirmVariant="danger"
        confirmLoading={transferMutation.isPending}
        closeOnBackdropPress={!transferMutation.isPending}
      >
        <Text style={styles.modalDescription}>
          위임하면 방장 권한이 넘어가고, 이후에는 이 관리 화면에 접근할 수 없어요.
        </Text>
      </Modal>

      <Modal
        visible={cancelVisible}
        title="여행을 취소하시겠어요?"
        onClose={() => setCancelVisible(false)}
        onCancel={() => setCancelVisible(false)}
        onConfirm={handleCancelTrip}
        cancelText="돌아가기"
        confirmText="여행 취소"
        confirmVariant="danger"
        confirmLoading={cancelMutation.isPending}
        closeOnBackdropPress={!cancelMutation.isPending}
      >
        <Text style={styles.modalDescription}>
          취소된 여행의 멤버와 기록은 보존되지만 다시 참여할 수 없어요.
        </Text>
      </Modal>
    </ScreenLayout>
  );
}
