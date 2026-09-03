import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import type { MockUserProfile } from '@travel-gacha/store';
import { colors } from '@travel-gacha/ui';
import { Modal } from '@/components/Modal';

import { styles } from './index.css';

type ProfileUpdate = Pick<MockUserProfile, 'nickname' | 'age'>;

type ProfileEditModalProps = {
  visible: boolean;
  profile: MockUserProfile;
  onClose: () => void;
  onSave: (profile: ProfileUpdate) => void;
};

export function ProfileEditModal({ visible, profile, onClose, onSave }: ProfileEditModalProps) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [age, setAge] = useState(String(profile.age));

  useEffect(() => {
    if (!visible) return;
    setNickname(profile.nickname);
    setAge(String(profile.age));
  }, [profile.age, profile.nickname, visible]);

  const parsedAge = Number(age);
  const isValid =
    nickname.trim().length > 0 && Number.isInteger(parsedAge) && parsedAge >= 1 && parsedAge <= 120;

  const handleSave = () => {
    if (!isValid) return;
    onSave({ nickname: nickname.trim(), age: parsedAge });
  };

  return (
    <Modal
      visible={visible}
      title="프로필 수정"
      confirmText="저장하기"
      confirmDisabled={!isValid}
      onClose={onClose}
      onConfirm={handleSave}
    >
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>닉네임</Text>
          <TextInput
            accessibilityLabel="닉네임 수정"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={12}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해주세요"
            placeholderTextColor={colors.grey300}
            style={styles.input}
            value={nickname}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>나이</Text>
          <View style={styles.ageInputWrap}>
            <TextInput
              accessibilityLabel="나이 수정"
              keyboardType="number-pad"
              maxLength={3}
              onChangeText={(value) => setAge(value.replace(/[^0-9]/g, ''))}
              style={[styles.input, styles.ageInput]}
              value={age}
            />
            <View pointerEvents="none" style={styles.ageSuffix}>
              <Text style={styles.ageSuffixText}>세</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
