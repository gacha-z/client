import { theme } from '@travel-gacha/ui';

export default function Page() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.blue50,
        color: theme.colors.grey900
      }}
    >
      <h1 style={{ margin: '0 0 8px', color: theme.colors.blue700 }}>여행가챠 Web</h1>
      <p>웹은 기본 뼈대만 유지합니다. 1차 개발은 mobile 앱에서 진행합니다.</p>
    </main>
  );
}
