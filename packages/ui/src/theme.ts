/** 디자인 theme 단일 출처 — web · mobile 공통 */
export const theme = {
  colors: {
    white: '#ffffff',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',

    blue50: '#eef8fd',
    blue100: '#cae8f8',
    blue200: '#b0ddf4',
    blue300: '#8ccdf0',
    blue400: '#75c3ed',
    blue500: '#53b4e8',
    blue600: '#4ca4d3',
    blue700: '#3b80a5',
    blue800: '#2e6380',
    blue900: '#234c61',

    grey50: '#f1f2f4',
    grey100: '#d5d6dc',
    grey200: '#c0c3cb',
    grey300: '#a3a7b4',
    grey400: '#9196a5',
    grey500: '#767c8f',
    grey600: '#6b7182',
    grey700: '#545866',
    grey800: '#41444f',
    grey900: '#32343c'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16
  },
  fontFamily: {
    sans: '"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif'
  }
} as const;

export type Theme = typeof theme;
export type ColorToken = keyof typeof theme.colors;

/** @deprecated theme.colors 사용 권장 */
export const colors = theme.colors;
