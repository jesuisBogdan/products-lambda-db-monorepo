module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'google',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'double'],
    'max-len': ['error', { code: 100 }],
  },
};
