import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  content: { gap: 20, paddingBottom: 28 },
  regionImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: colors.grey100
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12
  },
  title: {
    flex: 1,
    color: colors.grey900,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '800'
  },
  infoCard: {
    gap: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 16,
    backgroundColor: colors.white
  },
  section: {
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 16,
    backgroundColor: colors.white
  },
  recordSection: { gap: 12 },
  sectionTitle: { color: colors.grey900, fontSize: 16, fontWeight: '800' },
  memberRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  memberName: { color: colors.grey700, fontSize: 14 },
  memberRole: { color: colors.blue500, fontSize: 13, fontWeight: '700' },
  inviteRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inviteCode: { flex: 1, color: colors.grey600, fontSize: 14 },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    backgroundColor: colors.blue50
  },
  copyLabel: { color: colors.blue500, fontSize: 13, fontWeight: '700' },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ff4f45',
    borderRadius: 12
  },
  cancelLabel: { color: '#ff4f45', fontSize: 15, fontWeight: '700' },
  state: { alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 },
  stateTitle: { color: colors.grey700, fontSize: 16, fontWeight: '700' },
  stateDescription: { color: colors.grey500, fontSize: 14, textAlign: 'center' },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.blue500
  },
  retryLabel: { color: colors.white, fontSize: 14, fontWeight: '700' },
  modalDescription: { color: colors.grey600, fontSize: 14, lineHeight: 21 },
  errorText: { color: '#ff4f45', fontSize: 13 }
});
