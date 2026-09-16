import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2
  },
  body: {
    gap: 8
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.grey900
  },
  statusText: {
    fontSize: 12,
    color: colors.grey400
  }
});
