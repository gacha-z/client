import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 110,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.outlineGrey,
    backgroundColor: colors.white,
    padding: 8
  },
  unverified: {
    backgroundColor: colors.purpleTint
  },
  ghost: {
    width: 110,
    borderStyle: 'dashed',
    backgroundColor: '#e8e8e8'
  },
  kickable: {
    width: 130,
    justifyContent: 'space-between'
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18
  },
  avatarPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: colors.grey100
  },
  name: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.black
  },
  status: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.blue500
  },
  statusUnverified: {
    color: colors.purple500
  }
});
