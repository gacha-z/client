import { StyleSheet } from 'react-native';

import { theme } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg
  },
  header: {
    minHeight: theme.spacing.lg,
    justifyContent: 'center',
    marginBottom: theme.spacing.md
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.black,
    textAlign: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  contentContainer: {
    paddingVertical: theme.spacing.sm
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.md
  },
  confirmButton: {
    minWidth: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.blue500,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg
  },
  confirmButtonDisabled: {
    backgroundColor: theme.colors.grey300
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: 16
  }
});
