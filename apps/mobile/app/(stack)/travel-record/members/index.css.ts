import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  content: { gap: 20, paddingBottom: 28 },
  section: {
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 16,
    backgroundColor: colors.white
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sectionTitle: { color: colors.grey900, fontSize: 16, fontWeight: '800' },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.blue50
  },
  editLabel: { color: colors.blue500, fontSize: 13, fontWeight: '700' },
  tripTitle: { color: colors.grey900, fontSize: 15, fontWeight: '700' },
  tripMeta: { color: colors.grey600, fontSize: 13 },
  emptyText: { color: colors.grey500, fontSize: 14 },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  memberName: { color: colors.grey700, fontSize: 14, fontWeight: '600' },
  memberActions: { flexDirection: 'row', gap: 8 },
  transferButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.grey50
  },
  transferLabel: { color: colors.grey700, fontSize: 12, fontWeight: '700' },
  kickButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 79, 69, 0.1)'
  },
  kickLabel: { color: '#ff4f45', fontSize: 12, fontWeight: '700' },
  modalDescription: { color: colors.grey600, fontSize: 14, lineHeight: 21 },
  state: { alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 },
  stateTitle: { color: colors.grey700, fontSize: 16, fontWeight: '700', textAlign: 'center' }
});
