import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    backgroundColor: colors.blue100
  },
  authorName: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.grey900
  },
  moreButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menu: {
    minWidth: 96,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grey200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 30
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.grey700
  },
  menuItemTextDanger: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ff4f45'
  },
  content: {
    fontSize: 14,
    color: colors.grey900,
    lineHeight: 20
  },
  createdAt: {
    alignSelf: 'flex-end',
    fontSize: 10,
    fontWeight: '700',
    color: colors.grey400
  }
});
