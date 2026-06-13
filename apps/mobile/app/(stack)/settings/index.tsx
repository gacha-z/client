import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '설정' }} />
      <View>
        <Text>설정</Text>
      </View>
    </>
  );
}
