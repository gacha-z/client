import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';

import { isApiError, joinTrip } from '@travel-gacha/api';
import { colors } from '@travel-gacha/ui';
import { Bigbutton } from '@/components/Bigbutton';
import { ScreenLayout } from '@/components/ScreenLayout';
import { getCachedMemberId } from '@/services/authSession';

import { styles } from './index.css';

export default function TravelJoinScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const memberId = getCachedMemberId();

  const joinMutation = useMutation({
    mutationFn: joinTrip,
    onSuccess: (tripId) => {
      router.replace({ pathname: '/travel-record', params: { tripId } });
    }
  });

  const trimmedCode = code.trim();
  const canSubmit = trimmedCode.length > 0 && Boolean(memberId);

  const handleSubmit = () => {
    if (!canSubmit || !memberId) return;
    joinMutation.mutate({ code: trimmedCode, memberId });
  };

  return (
    <ScreenLayout title="여행 참여" showBack fallbackRoute="/" scrollable>
      <View style={styles.content}>
        <Text style={styles.description}>
          함께 떠날 친구에게 받은 초대 코드를 입력하면{`\n`}같은 여행방에 참여할 수 있어요.
        </Text>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>초대 코드</Text>
          <TextInput
            accessibilityLabel="초대 코드 입력"
            autoCapitalize="characters"
            autoCorrect={false}
            placeholder="초대 코드를 입력해주세요"
            placeholderTextColor={colors.grey300}
            style={styles.input}
            value={code}
            onChangeText={setCode}
          />
        </View>
        {joinMutation.isError ? (
          <Text style={styles.errorText}>
            {isApiError(joinMutation.error)
              ? joinMutation.error.message
              : '여행에 참여하지 못했어요. 초대 코드를 다시 확인해주세요.'}
          </Text>
        ) : null}
        <Bigbutton
          label="참여하기"
          disabled={!canSubmit}
          loading={joinMutation.isPending}
          onPress={handleSubmit}
        />
      </View>
    </ScreenLayout>
  );
}
