import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4f0ff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60
  },
  cameraPreview: {
    ...StyleSheet.absoluteFill
  },
  header: {
    alignItems: 'center'
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black
  },
  mission: {
    fontSize: 12,
    color: colors.white,
    marginTop: 4
  },
  countdown: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.white,
    marginTop: 12
  },
  shutter: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.blue500,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shutterRecording: {
    backgroundColor: '#ff5252',
    opacity: 0.85
  },
  permissionContainer: {
    paddingHorizontal: 24,
    gap: 16
  },
  permissionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center'
  },
  permissionButton: {
    backgroundColor: colors.blue500,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white
  }
});
