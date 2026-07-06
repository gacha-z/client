import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'visible'
  },
  triggerWrap: {
    alignSelf: 'flex-start'
  },
  menu: {
    position: 'absolute',
    top: '100%',
    marginTop: 4,
    zIndex: 30
  },
  menuLeft: {
    left: 0
  },
  menuRight: {
    right: 0
  }
});
