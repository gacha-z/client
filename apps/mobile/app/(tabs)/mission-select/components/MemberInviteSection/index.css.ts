import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  section: {
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 16,
    backgroundColor: colors.white
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.grey900 },
  sectionHint: { fontSize: 13, color: colors.grey400 },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.grey50
  },
  linkText: { flex: 1, color: colors.grey600, fontSize: 13 },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.blue50
  },
  copyLabel: { color: colors.blue500, fontSize: 12, fontWeight: '700' },
  shareButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.grey900
  },
  shareLabel: { color: colors.white, fontSize: 14, fontWeight: '700' },
  memberList: { gap: 4, paddingTop: 4 },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  memberName: { color: colors.grey700, fontSize: 14, fontWeight: '600' },
  kickButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 79, 69, 0.1)'
  },
  kickLabel: { color: '#ff4f45', fontSize: 12, fontWeight: '700' }
});
