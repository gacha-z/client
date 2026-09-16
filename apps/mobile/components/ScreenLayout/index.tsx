import type { ReactNode, Ref } from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';
import type { Href } from 'expo-router';

import { Header } from '@/components/Header';
import { Topbar } from '@/components/Topbar';

import { styles } from './index.css';

type ScreenLayoutProps = {
  title: string;
  showHeader?: boolean;
  headerActions?: boolean;
  showTopbar?: boolean;
  showBack?: boolean;
  onPressBack?: () => void;
  fallbackRoute?: Href;
  topbarRight?: ReactNode;
  onPressTopbarRight?: () => void;
  scrollable?: boolean;
  scrollViewRef?: Ref<ScrollView>;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
  children: ReactNode;
};

/** Header + Topbar + 콘텐츠 공통 화면 뼈대 */
export function ScreenLayout({
  title,
  showHeader = true,
  headerActions = false,
  showTopbar = true,
  showBack,
  onPressBack,
  fallbackRoute,
  topbarRight,
  onPressTopbarRight,
  scrollable = false,
  scrollViewRef,
  keyboardShouldPersistTaps,
  children
}: ScreenLayoutProps) {
  const content = scrollable ? (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.content}>{children}</View>
  );

  return (
    <View style={styles.container}>
      {showHeader && <Header showActions={headerActions} />}
      {showTopbar && (
        <Topbar
          title={title}
          showBack={showBack}
          onPressBack={onPressBack}
          fallbackRoute={fallbackRoute}
          right={topbarRight}
          onPressRight={onPressTopbarRight}
        />
      )}
      {content}
    </View>
  );
}
