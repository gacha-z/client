import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  content: {
    gap: 20,
    paddingBottom: 24
  },
  heading: {
    paddingHorizontal: 4,
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '700',
    color: colors.grey900
  },
  scheduledSection: {
    paddingTop: 10,
    gap: 12
  },
  sectionTitle: {
    paddingHorizontal: 4,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.grey900
  },
  tripList: {
    gap: 16
  }
});
