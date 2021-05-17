module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'], // should be removed when we move away from using any,
    '@typescript-eslint/ban-ts-ignore': ['off'], // should also be removed eventually
    '@typescript-eslint/explicit-module-boundary-types': ['off'], // remove
    '@typescript-eslint/ban-ts-comment': ['off'], // remove
    '@typescript-eslint/ban-types': ['off']
  },
  ignorePatterns: ['lib/**/*']
}
