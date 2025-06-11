module.exports = {
  extends: ["airbnb-base", "plugin:prettier/recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["node_modules/*", "lib/*"],
  rules: {
    "linebreak-style": "off",
    "no-console": "off",
    "no-restricted-syntax": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        pathGroups: [{ pattern: "@cumulusds/**", group: "internal" }],
        pathGroupsExcludedImportTypes: ["internal"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true, // Prevents conflicts with `import/order`
        ignoreMemberSort: false, // Ensures named imports are sorted
      },
    ],
    "@typescript-eslint/consistent-type-imports": "error",
  },
  parser: "@typescript-eslint/parser",
  plugins: ["jest", "@typescript-eslint"],
  env: {
    "jest/globals": true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  overrides: [
    {
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended"],
    },
  ],
};
