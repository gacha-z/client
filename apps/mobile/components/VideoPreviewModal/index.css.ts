import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoWrap: {
    width: '100%',
    height: '70%'
  },
  video: {
    width: '100%',
    height: '100%'
  },
  closeButton: {
    position: 'absolute',
    top: 56,
    right: 20
  }
});
