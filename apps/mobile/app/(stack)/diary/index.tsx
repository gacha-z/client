import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createDiary,
  isApiError,
  tripDiariesQueryKey,
  tripDiariesQueryOptions
} from '@travel-gacha/api';
import { ScreenLayout } from '@/components/ScreenLayout';
import { getDevMemberId } from '@/services/authSession';

import { DiaryCard } from './components/DiaryCard';
import { DiaryWriteModal } from './components/DiaryWriteModal';
import { styles } from './index.css';

export default function DiaryScreen() {
  const { tripId: tripIdParam } = useLocalSearchParams<{ tripId?: string }>();
  const tripId = tripIdParam ?? '';
  const memberId = getDevMemberId();
  const queryClient = useQueryClient();

  const [writeVisible, setWriteVisible] = useState(false);
  const [draft, setDraft] = useState('');

  const diariesQuery = useQuery({
    ...tripDiariesQueryOptions({ tripId, memberId }),
    enabled: Boolean(tripId)
  });

  const createMutation = useMutation({
    mutationFn: createDiary,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tripDiariesQueryKey(tripId) });
      setWriteVisible(false);
      setDraft('');
    }
  });

  const handleSubmit = () => {
    if (!memberId || !draft.trim()) return;
    createMutation.mutate({ tripId, memberId, content: draft.trim() });
  };

  return (
    <ScreenLayout title="여행 일기장" scrollable showBack fallbackRoute="/travel">
      <View style={styles.container}>
        <Pressable style={styles.writeButton} onPress={() => setWriteVisible(true)}>
          <Text style={styles.writeLabel}>글쓰기</Text>
        </Pressable>

        {diariesQuery.isPending ? <ActivityIndicator style={styles.state} /> : null}
        {diariesQuery.isError ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>일기를 불러오지 못했어요.</Text>
            <Text style={styles.stateDescription}>
              {isApiError(diariesQuery.error)
                ? diariesQuery.error.message
                : '잠시 후 다시 시도해주세요.'}
            </Text>
          </View>
        ) : null}
        {diariesQuery.isSuccess && diariesQuery.data.length === 0 ? (
          <Text style={styles.emptyText}>아직 작성된 일기가 없어요.</Text>
        ) : null}
        <View style={styles.list}>
          {diariesQuery.data?.map((diary) => (
            <DiaryCard key={diary.id} diary={diary} />
          ))}
        </View>
      </View>

      <DiaryWriteModal
        visible={writeVisible}
        value={draft}
        onChangeValue={setDraft}
        onClose={() => setWriteVisible(false)}
        onSubmit={handleSubmit}
        submitLoading={createMutation.isPending}
        errorMessage={
          createMutation.isError
            ? isApiError(createMutation.error)
              ? createMutation.error.message
              : '일기를 저장하지 못했어요.'
            : undefined
        }
      />
    </ScreenLayout>
  );
}
