export type MockSignupInput = {
  nickname: string;
  age: number;
};

export type MockLoginResult = {
  isFirstLogin: boolean;
};

/** TODO: 실제 Apple 로그인 API 호출로 교체합니다. */
export function mockAppleLogin(): Promise<MockLoginResult> {
  return Promise.resolve({ isFirstLogin: true });
}

/** TODO: 실제 회원가입 API 호출로 교체합니다. */
export function mockSignup(input: MockSignupInput): Promise<void> {
  void input;
  return Promise.resolve();
}
