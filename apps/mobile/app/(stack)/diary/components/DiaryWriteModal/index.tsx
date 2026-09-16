import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';

import { createDiary, generateDiaryDraft, isApiError, updateDiary } from '@travel-gacha/api';
import type { DiaryDetail } from '@travel-gacha/types';
import { Modal } from '@/components/Modal';

import { styles } from './index.css';

type DiaryWriteModalProps = {
  visible: boolean;
  tripId: string;
  memberId: number;
  mode: 'create' | 'edit';
  diaryDate?: string;
  diaryId?: string;
  initialContent?: string;
  onClose: () => void;
  onSaved: (diary: DiaryDetail) => void;
};

export function DiaryWriteModal({
  visible,
  tripId,
  memberId,
  mode,
  diaryDate,
  diaryId,
  initialContent,
  onClose,
  onSaved
}: DiaryWriteModalProps) {
  const [content, setContent] = useState(initialContent ?? '');
  const [sourceContent, setSourceContent] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (visible) {
      setContent(initialContent ?? '');
      setSourceContent(undefined);
    }
  }, [visible, initialContent]);

  const generateMutation = useMutation({
    mutationFn: () => generateDiaryDraft({ tripId, memberId, content }),
    onSuccess: (generated) => {
      setSourceContent((current) => current ?? content);
      setContent(generated);
    }
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      if (mode === 'create') {
        if (!diaryDate) throw new Error('diaryDate is required to create a diary');
        return createDiary({
          tripId,
          memberId,
          content,
          diaryDate,
          isAiGenerated: sourceContent !== undefined,
          sourceContent
        });
      }
      if (!diaryId) throw new Error('diaryId is required to edit a diary');
      return updateDiary({ diaryId, memberId, content });
    },
    onSuccess: (diary) => onSaved(diary)
  });

  const busy = generateMutation.isPending || saveMutation.isPending;

  return (
    <Modal
      visible={visible}
      title={mode === 'create' ? '오늘의 일기 쓰기' : '일기 수정하기'}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={() => saveMutation.mutate()}
      cancelText="취소"
      confirmText={mode === 'create' ? '작성하기' : '수정하기'}
      confirmDisabled={content.trim().length === 0}
      confirmLoading={saveMutation.isPending}
      closeOnBackdropPress={!busy}
    >
      <View style={styles.field}>
        <TextInput
          style={styles.textarea}
          multiline
          placeholder="오늘 하루를 기록해보세요."
          value={content}
          onChangeText={setContent}
          editable={!busy}
        />
      </View>
      <Pressable
        style={[styles.aiButton, generateMutation.isPending && styles.aiButtonDisabled]}
        disabled={busy}
        onPress={() => generateMutation.mutate()}
      >
        {generateMutation.isPending ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text style={styles.aiButtonLabel}>AI로 초안 생성하기</Text>
        )}
      </Pressable>
      {generateMutation.isError ? (
        <Text style={styles.errorText}>
          {isApiError(generateMutation.error)
            ? generateMutation.error.message
            : 'AI 초안을 생성하지 못했어요.'}
        </Text>
      ) : null}
      {saveMutation.isError ? (
        <Text style={styles.errorText}>
          {isApiError(saveMutation.error)
            ? saveMutation.error.message
            : '일기를 저장하지 못했어요.'}
        </Text>
      ) : null}
    </Modal>
  );
}
