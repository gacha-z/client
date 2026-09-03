import { Stack } from 'expo-router';

import { AuthenticatedRoute } from '@/components/AuthenticatedRoute';

export default function StackLayout() {
  return (
    <AuthenticatedRoute>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthenticatedRoute>
  );
}
