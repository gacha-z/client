import 'react-native-gesture-handler';

import { Stack } from 'expo-router';

import { AppProviders } from '@travel-gacha/store';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(stack)" />
      </Stack>
    </AppProviders>
  );
}
