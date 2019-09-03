module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    browser: true,
    es6: true
  },
  extends: ["plugin:@typescript-eslint/recommended", "google", "prettier", "prettier/@typescript-eslint"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/ban-ts-ignore": 0
  }
};
