import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    gap: 30,
    paddingBottom: 28
  },
  profileSection: {
    gap: 18
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18
  },
  avatar: {
    width: 76,
    height: 76,
    overflow: 'hidden',
    alignItems: 'center',
    borderRadius: 38,
    backgroundColor: colors.grey200
  },
  avatarHead: {
    width: 29,
    height: 29,
    marginTop: 13,
    borderRadius: 15,
    backgroundColor: colors.grey50
  },
  avatarBody: {
    width: 58,
    height: 38,
    marginTop: 7,
    borderTopLeftRadius: 29,
    borderTopRightRadius: 29,
    backgroundColor: colors.grey50
  },
  profileCopy: {
    flex: 1,
    gap: 2
  },
  nickname: {
    marginBottom: 2,
    color: colors.grey900,
    fontSize: 18,
    fontWeight: '700'
  },
  profileMeta: {
    color: colors.grey400,
    fontSize: 14,
    lineHeight: 20
  },
  profileEditButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: 12,
    backgroundColor: colors.white
  },
  profileEditLabel: {
    color: colors.grey600,
    fontSize: 16,
    fontWeight: '700'
  },
  settingsSection: {
    gap: 8
  },
  menuSection: {
    gap: 10
  },
  sectionHeader: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  sectionTitle: {
    color: colors.grey900,
    fontSize: 18,
    fontWeight: '700'
  },
  arrowExpanded: {
    transform: [{ rotate: '180deg' }]
  },
  permissionList: {
    gap: 2
  },
  accountActions: {
    gap: 10
  },
  accountAction: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  accountActionLabel: {
    color: colors.grey900,
    fontSize: 18,
    fontWeight: '700'
  },
  withdrawalLabel: {
    color: '#bd4545'
  },
  pressed: {
    opacity: 0.6
  }
});
