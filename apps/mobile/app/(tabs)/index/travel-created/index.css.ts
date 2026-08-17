import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  content: {
    gap: 20,
    paddingBottom: 28
  },
  hero: {
    position: 'relative',
    height: 155,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 18,
    backgroundColor: colors.blue50
  },
  heroCircleLeft: {
    position: 'absolute',
    width: 116,
    height: 116,
    left: -52,
    bottom: -40,
    borderRadius: 58,
    backgroundColor: colors.blue100
  },
  heroCircleRight: {
    position: 'absolute',
    width: 128,
    height: 128,
    right: -42,
    top: -46,
    borderRadius: 64,
    backgroundColor: colors.blue100
  },
  ticket: {
    minWidth: 250,
    paddingHorizontal: 10,
    paddingVertical: 18,
    gap: 10,
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
    transform: [{ rotate: '-7deg' }]
  },
  ticketBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: colors.blue50,
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue500
  },
  ticketTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.grey900
  },
  intro: {
    gap: 10
  },
  heading: {
    fontSize: 20,
    lineHeight: 34,
    fontWeight: '800',
    color: colors.grey900
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.grey500,
    fontWeight: '400'
  },
  infoCard: {
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 18,
    backgroundColor: colors.white
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  infoTitle: {
    fontSize: 16,
    lineHeight: 28,
    fontWeight: '800',
    color: colors.grey900
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: colors.blue50,
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue500
  },
  infoRows: {
    gap: 12
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16
  },
  infoLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: colors.grey900
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.grey900
  },
  invitationCard: {
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 18,
    backgroundColor: colors.grey50
  },
  invitationTitle: {
    fontSize: 16,
    lineHeight: 28,
    fontWeight: '800',
    color: colors.grey900
  },
  linkBox: {
    height: 54,
    paddingLeft: 14,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 12,
    backgroundColor: colors.white
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: colors.grey500
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    backgroundColor: colors.blue50
  },
  copyText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.blue500
  }
});
