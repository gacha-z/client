import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'visible'
  },
  backdrop: {
    flex: 1
  },
  triggerWrap: {
    alignSelf: 'flex-start'
  },
  triggerWrapFullWidth: {
    alignSelf: 'stretch',
    width: '100%'
  },
  menu: {
    position: 'absolute',
    zIndex: 30
  },
  menuHidden: {
    opacity: 0
  }
});
