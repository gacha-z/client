import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    backgroundColor: '#d4f0ff',
    padding: 16,
    justifyContent: 'space-between'
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  avatar: {
    width: 27,
    height: 27,
    borderRadius: 27 / 2,
    backgroundColor: colors.blue400
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.grey900
  },
  time: {
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: '700',
    color: colors.white
  }
});
