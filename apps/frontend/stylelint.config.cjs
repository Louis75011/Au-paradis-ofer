module.exports = {
  root: true,
  parserOptions: { tsconfigRootDir: __dirname, project: "./tsconfig.json" },
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:storybook/recommended",
    "prettier",
  ],
  plugins: ["react", "react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/triple-slash-reference": "off",
    "import/order": ["error", { "newlines-between": "always" }],
  },
};
