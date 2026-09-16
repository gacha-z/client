import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteDiary,
  isApiError,
  tripDetailQueryOptions,
  tripDiaryDetailQueryOptions,
  tripDiaryListQueryKey,
  tripDiaryListQueryOptions
} from '@travel-gacha/api';
import { Modal } from '@/components/Modal';
import { ScreenLayout } from '@/components/ScreenLayout';
import { getDevMemberId } from '@/services/authSession';

import { DiaryCard, type DiaryCardData } from './components/DiaryCard';
import { DiaryWriteModal } from './components/DiaryWriteModal';
import { styles } from './index.css';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toIsoDate = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(
    date.getUTCDate()
  ).padStart(2, '0')}`;

export default function DiaryScreen() {
  const { tripId: tripIdParam } = useLocalSearchParams<{ tripId?: string }>();
  const tripId = tripIdParam ?? '';
  const memberId = getDevMemberId();
  const queryClient = useQueryClient();

  const [dayIndex, setDayIndex] = useState(0);
  const [writeVisible, setWriteVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<DiaryCardData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DiaryCardData | null>(null);

  const tripQuery = useQuery({
    ...tripDetailQueryOptions(tripId, memberId),
    enabled: Boolean(tripId) && Boolean(memberId)
  });
  const trip = tripQuery.data;

  const totalDays = trip
    ? Math.max(
        1,
        Math.round(
          (Date.parse(`${trip.endDate}T00:00:00Z`) - Date.parse(`${trip.startDate}T00:00:00Z`)) /
            MS_PER_DAY
        ) + 1
      )
    : 1;
  const dayDate = trip
    ? new Date(Date.parse(`${trip.startDate}T00:00:00Z`) + dayIndex * MS_PER_DAY)
    : undefined;
  const diaryDate = dayDate ? toIsoDate(dayDate) : '';
  const dateLabel = diaryDate.replaceAll('-', '.');

  const listQuery = useQuery({
    ...tripDiaryListQueryOptions({ tripId, diaryDate, memberId }),
    enabled: Boolean(tripId) && Boolean(diaryDate) && Boolean(memberId)
  });
  const listItems = listQuery.data ?? [];

  const detailQueries = useQueries({
    queries: listItems.map((item) =>
      tripDiaryDetailQueryOptions({ tripId, diaryId: item.id, memberId })
    )
  });
  const diaries: DiaryCardData[] = detailQueries
    .map((query) => query.data)
    .filter((detail): detail is NonNullable<typeof detail> => Boolean(detail))
    .map((detail) => ({
      id: detail.id,
      memberNickname: detail.memberNickname,
      content: detail.content,
      diaryDate: detail.diaryDate,
      isOwn: memberId !== undefined && detail.memberId === String(memberId)
    }));
  const isDetailPending = detailQueries.some((query) => query.isPending);

  const deleteMutation = useMutation({
    mutationFn: deleteDiary,
    onSuccess: async () => {
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: tripDiaryListQueryKey(tripId, diaryDate) });
    }
  });

  const handleSaved = async () => {
    setWriteVisible(false);
    setEditTarget(null);
    await queryClient.invalidateQueries({ queryKey: tripDiaryListQueryKey(tripId, diaryDate) });
  };

  return (
    <ScreenLayout title="여행 일기장" scrollable showBack fallbackRoute="/travel">
      <View style={styles.container}>
        <View style={styles.dateRow}>
          <Pressable onPress={() => setDayIndex((index) => Math.max(0, index - 1))} hitSlop={8}>
            <Text style={[styles.dateArrow, dayIndex === 0 && styles.dateArrowDisabled]}>‹</Text>
          </Pressable>
          <Text style={styles.dateText}>{dateLabel}</Text>
          <Pressable
            onPress={() => setDayIndex((index) => Math.min(totalDays - 1, index + 1))}
            hitSlop={8}
          >
            <Text style={[styles.dateArrow, dayIndex >= totalDays - 1 && styles.dateArrowDisabled]}>
              ›
            </Text>
          </Pressable>
        </View>

        <Pressable style={styles.writeButton} onPress={() => setWriteVisible(true)}>
          <Text style={styles.writeLabel}>글쓰기</Text>
        </Pressable>

        {listQuery.isPending || isDetailPending ? <ActivityIndicator style={styles.state} /> : null}
        {listQuery.isError ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>일기를 불러오지 못했어요.</Text>
            <Text style={styles.stateDescription}>
              {isApiError(listQuery.error) ? listQuery.error.message : '잠시 후 다시 시도해주세요.'}
            </Text>
          </View>
        ) : null}
        {listQuery.isSuccess && listItems.length === 0 ? (
          <Text style={styles.emptyText}>이 날짜엔 작성된 일기가 없어요.</Text>
        ) : null}
        <View style={styles.list}>
          {diaries.map((diary) => (
            <DiaryCard
              key={diary.id}
              diary={diary}
              onEdit={() => setEditTarget(diary)}
              onDelete={() => setDeleteTarget(diary)}
            />
          ))}
        </View>
      </View>

      {memberId !== undefined ? (
        <DiaryWriteModal
          visible={writeVisible}
          mode="create"
          tripId={tripId}
          memberId={memberId}
          diaryDate={diaryDate}
          onClose={() => setWriteVisible(false)}
          onSaved={() => void handleSaved()}
        />
      ) : null}

      {memberId !== undefined && editTarget ? (
        <DiaryWriteModal
          visible={Boolean(editTarget)}
          mode="edit"
          tripId={tripId}
          memberId={memberId}
          diaryId={editTarget.id}
          initialContent={editTarget.content}
          onClose={() => setEditTarget(null)}
          onSaved={() => void handleSaved()}
        />
      ) : null}

      <Modal
        visible={Boolean(deleteTarget)}
        title="일기를 삭제하시겠어요?"
        onClose={() => setDeleteTarget(null)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget || memberId === undefined) return;
          deleteMutation.mutate({ diaryId: deleteTarget.id, memberId });
        }}
        cancelText="취소"
        confirmText="삭제"
        confirmVariant="danger"
        confirmLoading={deleteMutation.isPending}
        closeOnBackdropPress={!deleteMutation.isPending}
      >
        <Text style={styles.stateDescription}>삭제한 일기는 다시 되돌릴 수 없어요.</Text>
        {deleteMutation.isError ? (
          <Text style={styles.errorText}>
            {isApiError(deleteMutation.error)
              ? deleteMutation.error.message
              : '일기를 삭제하지 못했어요.'}
          </Text>
        ) : null}
      </Modal>
    </ScreenLayout>
  );
}
