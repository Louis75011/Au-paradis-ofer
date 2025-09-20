// eslint.config.mjs
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: ["node_modules/**", ".next/**", "dist/**", "storybook-static/**"],
  },
  ...tseslint.configs.recommended,
  {
    plugins: { react, "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  // conversion eslintrc → flat
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("plugin:storybook/recommended"),
  eslintConfigPrettier,
];

export default config;
