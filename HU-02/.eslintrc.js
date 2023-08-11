module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_' }],
    'no-unused-vars': 'off',
    'react-native/no-inline-styles': 0,
    'react-hooks/exhaustive-deps': 1,
    'no-bitwise': 0,
    'react/no-unstable-nested-components': 0,
  },
};
