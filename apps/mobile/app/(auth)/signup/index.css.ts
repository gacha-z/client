import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    gap: 24,
    paddingTop: 20
  },
  formCard: {
    padding: 18,
    gap: 18,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 18,
    backgroundColor: colors.white
  },
  introduction: {
    gap: 8
  },
  heading: {
    color: colors.grey900,
    fontSize: 19,
    fontWeight: '800'
  },
  description: {
    color: colors.grey400,
    fontSize: 14,
    lineHeight: 20
  },
  field: {
    gap: 8
  },
  label: {
    color: colors.grey900,
    fontSize: 14,
    fontWeight: '700'
  },
  input: {
    height: 54,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
    backgroundColor: colors.grey50,
    color: colors.grey900,
    fontSize: 17,
    fontWeight: '600'
  },
  ageInputWrap: {
    position: 'relative',
    justifyContent: 'center'
  },
  ageInput: {
    textAlign: 'center'
  },
  ageSuffix: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ageSuffixText: {
    color: colors.grey400,
    fontSize: 16
  },
  inputError: {
    borderColor: '#d95c5c',
    backgroundColor: '#fff7f7'
  },
  fieldError: {
    color: '#c74444',
    fontSize: 11,
    lineHeight: 16
  },
  submitError: {
    marginTop: -8,
    color: '#c74444',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center'
  },
  signupButton: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderRadius: 10,
    backgroundColor: colors.blue500
  },
  signupButtonDisabled: {
    backgroundColor: colors.grey300
  },
  signupButtonLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700'
  },
  pressed: {
    opacity: 0.75
  }
});
