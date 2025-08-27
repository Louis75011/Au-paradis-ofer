module.exports = {
  root: true,
  parserOptions: { tsconfigRootDir: __dirname, project: "./tsconfig.json" },
  extends: ["next/core-web-vitals", "plugin:import/recommended", "prettier"],
  rules: {
    "import/order": ["error", { "newlines-between": "always" }]
  }
};
