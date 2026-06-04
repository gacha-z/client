import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey50
  },
  content: {
    flex: 1,
    padding: 16
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1
  }
});
