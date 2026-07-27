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
  pendingRow: {
    flexDirection: 'row',
    gap: 16
  },
  pillList: {
    flex: 1,
    gap: 8
  },
  giveUpText: {
    fontSize: 13,
    color: '#797979',
    textAlign: 'center'
  },
  modalBody: {
    fontSize: 14,
    color: colors.grey800,
    textAlign: 'center',
    lineHeight: 20
  }
});
