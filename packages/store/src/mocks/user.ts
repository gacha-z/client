export type MockUserProfile = {
  nickname: string;
  email: string;
  gender: '여자' | '남자' | '기타';
  age: number;
};

export const MOCK_USER_PROFILE: MockUserProfile = {
  nickname: '이정선',
  email: 'dlwjdtns0111@gmail.com',
  gender: '여자',
  age: 24
};
