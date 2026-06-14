import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    overflow: 'visible',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.grey400,
    marginTop: 4
  },
  labelFocused: {
    color: colors.blue500,
    fontWeight: '700'
  },
  centerTab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 6,
    marginTop: -28
  },
  fabRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.blue500,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
