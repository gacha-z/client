import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  content: { gap: 24, paddingTop: 8 },
  description: { color: colors.grey600, fontSize: 15, lineHeight: 22 },
  field: { gap: 8 },
  fieldLabel: { color: colors.grey900, fontSize: 14, fontWeight: '700' },
  input: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.grey50,
    color: colors.grey900,
    fontSize: 17,
    fontWeight: '600'
  },
  errorText: { color: '#ff4f45', fontSize: 13 }
});
