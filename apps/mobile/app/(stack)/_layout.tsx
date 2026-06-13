import { Stack } from 'expo-router';

import { Header } from '@/components/Header';
import { Topbar } from '@/components/Topbar';

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ options }) => (
          <>
            <Header showActions={false} />
            <Topbar title={options.title ?? ''} />
          </>
        )
      }}
    />
  );
}
