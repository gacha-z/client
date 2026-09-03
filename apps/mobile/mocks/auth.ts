import {
  clearAuthSession,
  clearMockAccount,
  hasMockAccount,
  saveAuthSession,
  saveMockAccount
} from '@/services/authSession';

export type MockSignupInput = {
  nickname: string;
  age: number;
};

export type MockLoginResult = {
  isFirstLogin: boolean;
};

/** TODO: 실제 Apple 로그인 API 호출로 교체합니다. */
export async function mockAppleLogin(): Promise<MockLoginResult> {
  const isFirstLogin = !(await hasMockAccount());

  if (!isFirstLogin) await saveAuthSession();
  return { isFirstLogin };
}

/** TODO: 실제 회원가입 API 호출로 교체합니다. */
export async function mockSignup(input: MockSignupInput): Promise<void> {
  void input;
  await saveMockAccount();
  await saveAuthSession();
}

/** TODO: 실제 로그아웃 API 호출로 교체합니다. */
export function mockLogout() {
  return clearAuthSession();
}

/** TODO: 실제 회원 탈퇴 API 호출로 교체합니다. */
export async function mockWithdrawAccount(): Promise<void> {
  await clearAuthSession();
  await clearMockAccount();
}
