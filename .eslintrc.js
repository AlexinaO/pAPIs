module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2016,
    sourceType: 'module',
  },
  rules: {
    'no-plusplus': ['off'],
    'no-underscore-dangle': ['off'],
    'consistent-return': ['warn'],
    'prefer-promise-reject-errors': ['warn'],
    semi: ['error', 'never'],
    'no-tabs': ['off'],
    'quote-props': ['warn'],
    radix: ['off'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
}
