import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  field: {
    gap: 8
  },
  textarea: {
    height: 119,
    borderWidth: 1,
    borderColor: '#dadada',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.grey900,
    textAlignVertical: 'top'
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: '#ff4f45'
  }
});
