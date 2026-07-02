import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.grey700
  },
  row: {
    gap: 12
  }
});
