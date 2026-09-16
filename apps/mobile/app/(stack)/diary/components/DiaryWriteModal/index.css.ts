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
  aiButton: {
    marginTop: 12,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.blue500,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  aiButtonDisabled: {
    borderColor: colors.grey300
  },
  aiButtonLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.blue500
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: '#ff4f45',
    textAlign: 'center'
  }
});
