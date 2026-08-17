import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 16,
    backgroundColor: colors.white
  },
  title: {
    marginBottom: 14,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '800',
    color: colors.grey900
  },
  monthControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  arrowButton: {
    width: 32,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabledArrowButton: {
    opacity: 0.45
  },
  arrowRight: {
    transform: [{ rotate: '180deg' }]
  },
  selectGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8
  },
  selectBox: {
    minWidth: 94,
    height: 38,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white
  },
  selectText: {
    fontSize: 16,
    color: colors.grey900
  },
  caretDown: {
    transform: [{ rotate: '-90deg' }]
  },
  caretUp: {
    transform: [{ rotate: '90deg' }]
  },
  selectMenu: {
    width: 94,
    maxHeight: 240,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 9,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6
  },
  selectMenuScroll: {
    maxHeight: 220
  },
  selectOption: {
    minHeight: 38,
    paddingHorizontal: 12,
    justifyContent: 'center'
  },
  selectOptionSelected: {
    backgroundColor: colors.blue50
  },
  selectOptionText: {
    fontSize: 15,
    color: colors.grey700
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4
  },
  weekday: {
    width: '14.2857%',
    paddingVertical: 7,
    textAlign: 'center',
    fontSize: 12,
    color: colors.grey500
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  dayCell: {
    width: '14.2857%',
    aspectRatio: 1,
    padding: 2
  },
  dayButton: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rangeDay: {
    backgroundColor: colors.blue100
  },
  rangeEdge: {
    backgroundColor: colors.blue500
  },
  dayText: {
    fontSize: 15,
    color: colors.grey900
  },
  outsideDayText: {
    color: colors.grey200
  },
  disabledDayText: {
    color: colors.grey100
  },
  rangeEdgeText: {
    color: colors.white
  }
});
