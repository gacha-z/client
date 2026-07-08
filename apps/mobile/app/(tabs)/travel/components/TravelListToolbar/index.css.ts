import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    zIndex: 10
  },
  dropdownWrap: {
    position: 'relative',
    zIndex: 10
  },
  selectButton: {
    width: 80,
    height: 32,
    paddingLeft: 7,
    paddingRight: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.grey300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white
  },
  selectText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.grey400
  },
  dropdownMenu: {
    width: 80,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.grey200,
    backgroundColor: colors.white,
    paddingVertical: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4
  },
  dropdownItem: {
    minHeight: 32,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  dropdownItemSelected: {
    backgroundColor: colors.grey50
  },
  dropdownText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.grey500
  },
  dropdownTextSelected: {
    color: colors.grey600
  }
});
