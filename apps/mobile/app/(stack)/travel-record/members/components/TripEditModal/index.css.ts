import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  form: { gap: 16 },
  row: { flexDirection: 'row', gap: 12 },
  rowField: { flex: 1 },
  field: { gap: 8 },
  fieldLabel: { color: colors.grey900, fontSize: 13, fontWeight: '700' },
  input: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.grey50,
    color: colors.grey900,
    fontSize: 15,
    fontWeight: '600'
  }
});
