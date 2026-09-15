import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  content: {
    gap: 20,
    paddingBottom: 24
  },
  heading: {
    paddingHorizontal: 4,
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '700',
    color: colors.grey900
  },
  scheduledSection: {
    paddingTop: 10,
    gap: 12
  },
  sectionTitle: {
    paddingHorizontal: 4,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.grey900
  },
  tripList: {
    gap: 16
  },
  joinLink: {
    alignItems: 'center',
    paddingVertical: 4
  },
  joinLinkLabel: {
    color: colors.blue500,
    fontSize: 14,
    fontWeight: '700'
  },
  state: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 24
  },
  stateTitle: {
    color: colors.grey700,
    fontSize: 15,
    fontWeight: '700'
  },
  stateDescription: {
    color: colors.grey500,
    fontSize: 14,
    textAlign: 'center'
  },
  retryButton: {
    borderRadius: 999,
    backgroundColor: colors.blue500,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  retryLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700'
  }
});
