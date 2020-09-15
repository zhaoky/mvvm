module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    browser: true,
    es6: true,
  },
  extends: ["plugin:@typescript-eslint/recommended", "google", "prettier", "prettier/@typescript-eslint"],
  parserOptions: {
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
  },
};
