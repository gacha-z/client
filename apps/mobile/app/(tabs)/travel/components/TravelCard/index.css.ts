import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 10
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12
  },
  tripTitle: {
    flex: 1,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: colors.grey900
  },
  infoBlock: {
    gap: 7
  },
  cardFooter: {
    alignItems: 'flex-end',
    marginTop: 2
  }
});
