import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    backgroundColor: '#d4f0ff',
    padding: 13,
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start'
  },
  avatar: {
    width: 27,
    height: 27,
    borderRadius: 14
  },
  avatarPlaceholder: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: colors.white
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black
  },
  time: {
    flex: 1,
    fontSize: 30,
    fontWeight: '700',
    color: colors.white,
    textAlignVertical: 'center'
  },
  readyBadge: {
    borderWidth: 1,
    borderColor: '#979eb1',
    backgroundColor: 'rgba(151,158,177,0.1)',
    borderRadius: 1000,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 6
  },
  readyText: {
    fontSize: 12,
    color: '#979eb1'
  }
});
