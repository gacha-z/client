import 'react-native-gesture-handler';

import { Stack } from 'expo-router';

import { AppProviders } from '@travel-gacha/store';
import { AuthSessionGate } from '@/components/AuthSessionGate';

export default function RootLayout() {
  return (
    <AppProviders>
      <AuthSessionGate>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(stack)" />
        </Stack>
      </AuthSessionGate>
    </AppProviders>
  );
}
