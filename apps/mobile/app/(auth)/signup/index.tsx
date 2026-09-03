import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import { Redirect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';

import { authStatusAtom, completeSignupAtom } from '@travel-gacha/store';
import { colors } from '@travel-gacha/ui';
import { ScreenLayout } from '@/components/ScreenLayout';
import { mockSignup } from '@/mocks/auth';

import { styles } from './index.css';

export default function SignupScreen() {
  const authStatus = useAtomValue(authStatusAtom);
  const completeSignup = useSetAtom(completeSignupAtom);
  const ageInputRef = useRef<TextInput>(null);
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('20');
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [ageTouched, setAgeTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (authStatus === 'signedOut') return <Redirect href="/login" />;
  if (authStatus === 'signedIn') return <Redirect href="/" />;

  const parsedAge = Number(age);
  const normalizedNickname = nickname.trim();
  const nicknameError = nicknameTouched && normalizedNickname.length === 0;
  const ageError =
    ageTouched &&
    (age.length === 0 || !Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120);
  const isValid =
    normalizedNickname.length > 0 &&
    Number.isInteger(parsedAge) &&
    parsedAge >= 1 &&
    parsedAge <= 120;

  const handleSignup = async () => {
    setNicknameTouched(true);
    setAgeTouched(true);
    if (!isValid) return;

    Keyboard.dismiss();
    setIsLoading(true);
    setSubmitError(null);

    try {
      await mockSignup({ nickname: normalizedNickname, age: parsedAge });
      completeSignup();
    } catch {
      setSubmitError('가입 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScreenLayout
        title="회원가입"
        headerActions={false}
        showBack={false}
        scrollable
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.formCard}>
            <View style={styles.introduction}>
              <Text style={styles.heading}>기본 정보를 입력해주세요!</Text>
              <Text style={styles.description}>사용하실 닉네임과 나이를 입력해주세요.</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                accessibilityLabel="닉네임"
                autoCapitalize="none"
                autoComplete="nickname"
                autoCorrect={false}
                blurOnSubmit={false}
                maxLength={12}
                onBlur={() => setNicknameTouched(true)}
                onChangeText={setNickname}
                onSubmitEditing={() => ageInputRef.current?.focus()}
                placeholder="닉네임을 입력해주세요"
                placeholderTextColor={colors.grey300}
                returnKeyType="next"
                style={[styles.input, nicknameError && styles.inputError]}
                value={nickname}
              />
              {nicknameError && (
                <Text accessibilityLiveRegion="polite" style={styles.fieldError}>
                  공백이 아닌 닉네임을 입력해주세요.
                </Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>나이</Text>
              <View style={styles.ageInputWrap}>
                <TextInput
                  ref={ageInputRef}
                  accessibilityLabel="나이"
                  keyboardType="number-pad"
                  maxLength={3}
                  onBlur={() => setAgeTouched(true)}
                  onChangeText={(value) => setAge(value.replace(/[^0-9]/g, ''))}
                  onSubmitEditing={() => void handleSignup()}
                  returnKeyType="done"
                  style={[styles.input, styles.ageInput, ageError && styles.inputError]}
                  value={age}
                />
                <View pointerEvents="none" style={styles.ageSuffix}>
                  <Text style={styles.ageSuffixText}>세</Text>
                </View>
              </View>
              {ageError && (
                <Text accessibilityLiveRegion="polite" style={styles.fieldError}>
                  나이는 1세부터 120세까지 입력할 수 있어요.
                </Text>
              )}
            </View>
          </View>

          {submitError && (
            <Text accessibilityLiveRegion="polite" style={styles.submitError}>
              {submitError}
            </Text>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ busy: isLoading, disabled: !isValid || isLoading }}
            disabled={!isValid || isLoading}
            onPress={() => void handleSignup()}
            style={({ pressed }) => [
              styles.signupButton,
              (!isValid || isLoading) && styles.signupButtonDisabled,
              pressed && isValid && !isLoading && styles.pressed
            ]}
          >
            {isLoading && <ActivityIndicator color={colors.white} />}
            <Text style={styles.signupButtonLabel}>{isLoading ? '가입 중...' : '가입하기'}</Text>
          </Pressable>
        </View>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
