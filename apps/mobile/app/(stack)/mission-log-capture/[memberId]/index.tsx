import { useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import {
  isApiError,
  missionSetlogsQueryKey,
  tripMembersQueryOptions,
  uploadSetlog
} from '@travel-gacha/api';
import { activeMissionAtom } from '@travel-gacha/store';
import { colors } from '@travel-gacha/ui';
import { CameraIcon } from '@/components/icons';

import { styles } from './index.css';

const RECORD_SECONDS = 3;

const alertCaptureError = (error: unknown) => {
  Alert.alert(
    '오류',
    isApiError(error) ? error.message : '업로드에 실패했어요. 다시 시도해주세요.'
  );
};

export default function MissionLogCaptureScreen() {
  const { memberId, tripId: tripIdParam } = useLocalSearchParams<{
    memberId: string;
    tripId?: string;
  }>();
  const tripId = tripIdParam ?? process.env.EXPO_PUBLIC_DEV_TRIP_ID ?? '';
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeMission = useAtomValue(activeMissionAtom);

  const membersQuery = useQuery({ ...tripMembersQueryOptions(tripId), enabled: Boolean(tripId) });
  const member = membersQuery.data?.find((item) => item.id === memberId);

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (fileUri: string) => {
      if (!activeMission) throw new Error('진행 중인 미션이 없어요.');
      return uploadSetlog({
        tripId,
        tripMissionId: activeMission.tripMissionId,
        memberId,
        fileUri
      });
    },
    onSuccess: () => {
      if (activeMission) {
        queryClient.invalidateQueries({
          queryKey: missionSetlogsQueryKey(activeMission.tripMissionId)
        });
      }
      router.back();
    },
    onError: alertCaptureError
  });

  const isRecording = secondsLeft !== null;
  const isBusy = isRecording || uploadMutation.isPending;

  const handleShutter = async () => {
    if (isBusy || !cameraRef.current) return;

    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('오류', '카메라 권한이 필요해요. 설정에서 카메라 접근을 허용해주세요.');
        return;
      }
    }

    setSecondsLeft(RECORD_SECONDS);

    const countdown = setInterval(() => {
      setSecondsLeft((current) => (current !== null && current > 0 ? current - 1 : current));
    }, 1000);

    const stopTimer = setTimeout(() => {
      cameraRef.current?.stopRecording();
    }, RECORD_SECONDS * 1000);

    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: RECORD_SECONDS });
      clearInterval(countdown);
      clearTimeout(stopTimer);
      setSecondsLeft(null);

      if (video?.uri) {
        uploadMutation.mutate(video.uri);
      } else {
        Alert.alert('오류', '촬영에 실패했어요. 다시 시도해주세요.');
      }
    } catch {
      clearInterval(countdown);
      clearTimeout(stopTimer);
      setSecondsLeft(null);
      Alert.alert('오류', '촬영에 실패했어요. 다시 시도해주세요.');
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.cameraPreview} mode="video" facing="front" mute />
      <View style={styles.header}>
        <Text style={styles.name}>{member?.name ?? ''}</Text>
        <Text style={styles.mission}>MISSION 1</Text>
        {isRecording && secondsLeft !== null && secondsLeft > 0 && (
          <Text style={styles.countdown}>{secondsLeft}</Text>
        )}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="촬영 시작"
        accessibilityState={{ disabled: isBusy }}
        style={[styles.shutter, isRecording && styles.shutterRecording]}
        onPress={handleShutter}
        disabled={isBusy}
      >
        <CameraIcon size={32} color={colors.white} />
      </Pressable>
    </View>
  );
}
