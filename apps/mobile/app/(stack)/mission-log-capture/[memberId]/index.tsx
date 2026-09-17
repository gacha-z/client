import { useEffect, useRef, useState } from 'react';
import { Alert, Linking, Pressable, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
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
import { BackIcon, CameraIcon } from '@/components/icons';
import { getDevMemberId } from '@/services/authSession';

import { styles } from './index.css';

const RECORD_SECONDS = 3;

/** 촬영화면 회전 시 오버레이(글씨/아이콘)를 사람 기준으로 정자 유지시키기 위한 보정 각도 */
function rotationForOrientation(orientation: ScreenOrientation.Orientation): number {
  switch (orientation) {
    case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
      return 90;
    case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
      return -90;
    case ScreenOrientation.Orientation.PORTRAIT_DOWN:
      return 180;
    default:
      return 0;
  }
}

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
  const devMemberId = getDevMemberId();

  const membersQuery = useQuery({
    ...tripMembersQueryOptions(tripId, devMemberId),
    enabled: Boolean(tripId) && Boolean(devMemberId)
  });
  const member = membersQuery.data?.find((item) => item.id === memberId);

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [overlayRotation, setOverlayRotation] = useState(0);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // 이 화면에서만 회전을 허용하고, 나가면 앱 기본값(세로 고정)으로 되돌린다.
  useEffect(() => {
    ScreenOrientation.unlockAsync();
    ScreenOrientation.getOrientationAsync().then((orientation) =>
      setOverlayRotation(rotationForOrientation(orientation))
    );

    const subscription = ScreenOrientation.addOrientationChangeListener((event) =>
      setOverlayRotation(rotationForOrientation(event.orientationInfo.orientation))
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
      void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const overlayRotationStyle = { transform: [{ rotate: `${overlayRotation}deg` }] };

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
        Alert.alert(
          '카메라 권한이 필요해요',
          '미션로그 촬영을 위해 카메라 접근 권한이 필요해요. 설정 화면으로 이동할까요?',
          [
            { text: '취소', style: 'cancel' },
            { text: '설정으로 이동', onPress: () => void Linking.openSettings() }
          ]
        );
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

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <BackIcon size={20} color={colors.white} />
        </Pressable>
        <Text style={styles.permissionText}>미션로그 촬영을 위해 카메라 접근 권한이 필요해요.</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.permissionButton}
          onPress={() => (permission.canAskAgain ? requestPermission() : Linking.openSettings())}
        >
          <Text style={styles.permissionButtonText}>
            {permission.canAskAgain ? '카메라 권한 허용하기' : '설정으로 이동'}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.cameraPreview} mode="video" facing="back" mute />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <View style={overlayRotationStyle}>
          <BackIcon size={20} color={colors.white} />
        </View>
      </Pressable>
      <View style={styles.header}>
        <View style={overlayRotationStyle}>
          <Text style={styles.name}>{member?.name ?? ''}</Text>
          <Text style={styles.mission}>MISSION 1</Text>
          {isRecording && secondsLeft !== null && secondsLeft > 0 && (
            <Text style={styles.countdown}>{secondsLeft}</Text>
          )}
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="촬영 시작"
        accessibilityState={{ disabled: isBusy }}
        style={[styles.shutter, isRecording && styles.shutterRecording]}
        onPress={handleShutter}
        disabled={isBusy}
      >
        <View style={overlayRotationStyle}>
          <CameraIcon size={32} color={colors.white} />
        </View>
      </Pressable>
    </View>
  );
}
