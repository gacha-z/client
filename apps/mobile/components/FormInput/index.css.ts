import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  field: {
    gap: 8
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.grey900
  },
  innerLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: colors.grey300
  },
  textInput: {
    height: 54,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.grey50,
    fontSize: 17,
    fontWeight: '600',
    color: colors.grey900
  },
  selectInput: {
    flex: 1,
    minWidth: 0,
    width: '100%',
    height: 66,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
    backgroundColor: colors.grey50
  },
  menuAnchor: {
    flex: 1,
    minWidth: 0,
    width: '100%'
  },
  timeSelectInput: {
    width: '100%'
  },
  menu: {
    width: 170,
    maxHeight: 260,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6
  },
  optionScroll: {
    maxHeight: 200
  },
  option: {
    minHeight: 42,
    paddingHorizontal: 14,
    justifyContent: 'center'
  },
  selectedOption: {
    backgroundColor: colors.blue50
  },
  optionText: {
    fontSize: 15,
    color: colors.grey700
  },
  selectedOptionText: {
    fontWeight: '700',
    color: colors.blue600
  },
  selectValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  selectValue: {
    flexShrink: 1,
    fontSize: 18,
    lineHeight: 24,
    color: colors.grey900
  },
  arrowIcon: {
    transform: [{ rotate: '0deg' }]
  },
  arrowIconExpanded: {
    transform: [{ rotate: '180deg' }]
  },
  numberInput: {
    flex: 1,
    minWidth: 0,
    height: 66,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
    backgroundColor: colors.grey50
  },
  numberControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8
  },
  stepButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  downTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.blue500
  },
  downTriangleDisabled: {
    borderTopColor: colors.grey300
  },
  upTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.blue500
  },
  upTriangleDisabled: {
    borderBottomColor: colors.grey300
  },
  numberValue: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.grey900
  },
  suffix: {
    marginLeft: -5,
    fontSize: 14,
    color: colors.grey300
  }
});
