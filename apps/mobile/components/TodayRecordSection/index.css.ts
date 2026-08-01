// apps/mobile/components/TodayRecordSection/index.css.ts
import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
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
  }
});
