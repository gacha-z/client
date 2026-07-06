import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grey100
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10
  },
  tripTitle: {
    flex: 1,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: colors.grey900
  },
  moreButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButton: {
    minWidth: 92,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 30
  },
  deleteText: {
    color: '#ff4f45',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700'
  },
  dateRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dateText: {
    fontSize: 19,
    color: colors.grey400,
    fontWeight: '500'
  },
  nextDayButton: {
    transform: [{ rotate: '180deg' }]
  },
  dayActionRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  dayChip: {
    height: 30,
    paddingHorizontal: 14,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.blue500,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white
  },
  dayChipText: {
    color: colors.blue500,
    fontSize: 14,
    fontWeight: '700'
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  }
});
