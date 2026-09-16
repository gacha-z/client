import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    width: '48.2%',
    minHeight: 130,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.grey200,
    borderRadius: 16,
    backgroundColor: colors.white
  },
  containerLocked: {
    borderColor: colors.grey100,
    backgroundColor: colors.grey50
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  categoryTag: {
    minHeight: 20,
    justifyContent: 'center',
    paddingHorizontal: 7,
    borderWidth: 1,
    borderRadius: 5
  },
  categoryLabel: {
    fontSize: 9,
    fontWeight: '700'
  },
  categoryTagLocked: {
    borderColor: colors.grey200,
    backgroundColor: colors.grey50
  },
  categoryLabelLocked: {
    color: colors.grey400
  },
  itemTag: {
    borderColor: '#93d4aa',
    backgroundColor: '#edf8f1'
  },
  itemLabel: {
    color: '#287548'
  },
  badgeTag: {
    borderColor: colors.blue400,
    backgroundColor: colors.blue50
  },
  badgeLabel: {
    color: colors.blue700
  },
  iconWrap: {
    width: 28,
    height: 28,
    marginTop: 9,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemImage: {
    width: 28,
    height: 28,
    borderRadius: 4
  },
  copy: {
    gap: 4
  },
  title: {
    color: colors.grey900,
    fontSize: 15,
    fontWeight: '800'
  },
  requirement: {
    color: colors.grey600,
    fontSize: 11,
    lineHeight: 16
  },
  textLocked: {
    color: colors.grey400
  }
});
