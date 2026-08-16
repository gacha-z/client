import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  content: {
    gap: 20,
    paddingBottom: 24
  },
  notice: {
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 16,
    backgroundColor: colors.blue50
  },
  noticeCircleLarge: {
    position: 'absolute',
    width: 116,
    height: 116,
    top: -54,
    right: -14,
    borderRadius: 58,
    backgroundColor: colors.blue100
  },
  noticeCircleSmall: {
    position: 'absolute',
    width: 92,
    height: 92,
    left: -40,
    bottom: -52,
    borderRadius: 46,
    backgroundColor: colors.blue100
  },
  noticeTitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.grey900
  },
  noticeDescription: {
    maxWidth: '92%',
    fontSize: 14,
    lineHeight: 21,
    color: colors.grey500
  },
  candidateSection: {
    gap: 14
  },
  heading: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '800',
    color: colors.grey900
  },
  description: {
    marginBottom: 2,
    fontSize: 15,
    lineHeight: 22,
    color: colors.grey400
  }
});
