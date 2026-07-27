import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 20
  },
  section: {
    gap: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.grey900
  },
  sectionHint: {
    fontSize: 13,
    color: colors.grey400
  },
  carousel: {
    flexDirection: 'row',
    gap: 16
  }
});
