import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BellIcon, LogoIcon, SettingIcon } from '@/components/icons';

import { styles } from './index.css';

type HeaderProps = {
  title?: string;
  showActions?: boolean;
};

/** 앱 최상단 브랜드 영역 */
export function Header({ title = '여행가챠', showActions = true }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.left}>
        <LogoIcon />
        <Text style={styles.title}>{title}</Text>
      </View>
      {showActions && (
        <View style={styles.actions}>
          <Pressable onPress={() => router.push('/notification')} hitSlop={8}>
            <BellIcon size={24} />
          </Pressable>
          <Pressable onPress={() => router.push('/settings')} hitSlop={8}>
            <SettingIcon size={24} />
          </Pressable>
        </View>
      )}
    </View>
  );
}
