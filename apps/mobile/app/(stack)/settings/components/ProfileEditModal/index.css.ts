import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  form: {
    gap: 18
  },
  field: {
    gap: 8
  },
  fieldLabel: {
    color: colors.grey900,
    fontSize: 14,
    fontWeight: '700'
  },
  input: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.grey50,
    color: colors.grey900,
    fontSize: 17,
    fontWeight: '600'
  },
  ageInputWrap: {
    position: 'relative',
    justifyContent: 'center'
  },
  ageInput: {
    textAlign: 'center'
  },
  ageSuffix: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ageSuffixText: {
    color: colors.grey400,
    fontSize: 16
  }
});
