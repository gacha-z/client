import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: colors.white,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 2
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
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
  authorName: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.black
  },
  content: {
    gap: 8
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.black
  },
  body: {
    fontSize: 12,
    color: '#979eb1'
  },
  dateTime: {
    alignSelf: 'flex-end',
    fontSize: 10,
    fontWeight: '700',
    color: '#979eb1'
  }
});
