/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@travel-gacha/eslint-config/react'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  overrides: [
    {
      files: ['.eslintrc.cjs', 'metro.config.js', 'babel.config.js'],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off'
      }
    }
  ]
};
