import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { Header } from '@/components/Header';
import { Topbar } from '@/components/Topbar';

import { styles } from './index.css';

type ScreenLayoutProps = {
  title: string;
  showHeader?: boolean;
  headerActions?: boolean;
  topbarRight?: ReactNode;
  onPressTopbarRight?: () => void;
  scrollable?: boolean;
  children: ReactNode;
};

/** Header + Topbar + 콘텐츠 공통 화면 뼈대 */
export function ScreenLayout({
  title,
  showHeader = true,
  headerActions = false,
  topbarRight,
  onPressTopbarRight,
  scrollable = false,
  children
}: ScreenLayoutProps) {
  const content = scrollable ? (
    <ScrollView contentContainerStyle={styles.scrollContent}>{children}</ScrollView>
  ) : (
    <View style={styles.content}>{children}</View>
  );

  return (
    <View style={styles.container}>
      {showHeader && <Header showActions={headerActions} />}
      <Topbar title={title} right={topbarRight} onPressRight={onPressTopbarRight} />
      {content}
    </View>
  );
}
