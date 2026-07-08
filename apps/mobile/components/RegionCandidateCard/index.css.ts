import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: colors.white,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 16
  },
  default: {
    borderColor: '#d9d9d9'
  },
  selected: {
    borderColor: '#4BB4F3',
    shadowColor: '#53B4E8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4
  },
  image: {
    width: 115,
    height: 115,
    borderRadius: 4,
    backgroundColor: '#DDF1FF'
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 8
  },
  name: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.black
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: colors.grey600
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  hint: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: colors.grey700
  },
  retryButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.blue50,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
