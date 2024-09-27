module.exports = {
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  rules: {
    "linebreak-style": "off",
    "no-console": "off",
    "no-restricted-syntax": "off"
  },
  plugins: ["jest"],
  env: {
    "jest/globals": true
  },
  parserOptions: {
    ecmaVersion: 2020
  }
};
