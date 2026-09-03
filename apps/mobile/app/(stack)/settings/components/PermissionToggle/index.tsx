import { Switch, Text, View } from 'react-native';

import { colors } from '@travel-gacha/ui';

import { styles } from './index.css';

type PermissionToggleProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function PermissionToggle({ label, value, onValueChange }: PermissionToggleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        accessibilityLabel={`${label} 권한`}
        ios_backgroundColor={colors.grey200}
        onValueChange={onValueChange}
        thumbColor={colors.white}
        trackColor={{ false: colors.grey200, true: colors.blue500 }}
        value={value}
      />
    </View>
  );
}
