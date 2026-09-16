import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.blue300,
    borderRadius: 18,
    backgroundColor: colors.blue50
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  title: {
    color: colors.grey900,
    fontSize: 18,
    fontWeight: '800'
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  count: {
    color: colors.grey900,
    fontSize: 22,
    fontWeight: '800'
  },
  total: {
    color: colors.grey600,
    fontSize: 13,
    fontWeight: '600'
  },
  track: {
    height: 9,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: colors.white
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colors.blue500
  },
  caption: {
    color: colors.grey600,
    fontSize: 11,
    lineHeight: 16
  }
});
