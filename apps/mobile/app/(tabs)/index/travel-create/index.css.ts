import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  content: {
    gap: 20,
    paddingBottom: 24
  },
  fieldGroup: {
    gap: 8
  },
  fieldLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.grey900
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    gap: 12
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.grey300
  },
  section: {
    padding: 20,
    gap: 18,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 16,
    backgroundColor: colors.white
  },
  sectionHeader: {
    gap: 10
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '800',
    color: colors.grey900
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.grey300
  },
  confirmationDetails: {
    alignSelf: 'center',
    minWidth: 240,
    gap: 6,
    paddingVertical: 6
  },
  confirmationText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.grey700
  }
});
