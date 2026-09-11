import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 20,
    backgroundColor: colors.grey50
  },
  unreadCard: {
    borderColor: colors.blue100,
    backgroundColor: colors.blue50
  },
  pressed: {
    opacity: 0.78
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  categoryBadge: {
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: colors.blue100,
    color: colors.blue700,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  },
  readCategoryBadge: {
    backgroundColor: colors.grey100,
    color: colors.grey600
  },
  unreadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blue500
  },
  unreadLabel: {
    color: colors.blue700,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  },
  title: {
    color: colors.grey900,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '800'
  },
  readTitle: {
    color: colors.grey600
  },
  time: {
    paddingTop: 3,
    color: colors.grey400,
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '400'
  },
  body: {
    color: colors.grey500,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400'
  },
  readBody: {
    color: colors.grey400
  }
});
