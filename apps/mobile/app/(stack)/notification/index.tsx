import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotificationScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '알림' }} />
      <View>
        <Text>알림</Text>
      </View>
    </>
  );
}
