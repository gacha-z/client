import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';

import { MOCK_MEMBERS, verifyMemberAtom } from '@travel-gacha/store';
import { colors } from '@travel-gacha/ui';
import { CameraIcon } from '@/components/icons';

import { styles } from './index.css';

const RECORD_SECONDS = 3;

export default function MissionLogCaptureScreen() {
  const { memberId } = useLocalSearchParams<{ memberId: string }>();
  const router = useRouter();
  const verifyMember = useSetAtom(verifyMemberAtom);
  const member = MOCK_MEMBERS.find((item) => item.id === memberId);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (secondsLeft === null) return;

    if (secondsLeft === 0) {
      if (memberId) verifyMember(memberId);
      router.back();
      return;
    }

    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, memberId, verifyMember, router]);

  const isRecording = secondsLeft !== null;

  const handleShutter = () => {
    if (isRecording) return;
    setSecondsLeft(RECORD_SECONDS);
  };

  return (
    <View style={styles.container}>
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
        accessibilityState={{ disabled: isRecording }}
        style={[styles.shutter, isRecording && styles.shutterRecording]}
        onPress={handleShutter}
        disabled={isRecording}
      >
        <CameraIcon size={32} color={colors.white} />
      </Pressable>
    </View>
  );
}
