import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  framework: { name: "@storybook/nextjs", options: {} }, // <-- couvre components/ et app/, pas src/
  stories: [
    "../components/**/*.stories.@(ts|tsx|mdx)",
    "../app/**/*.stories.@(ts|tsx|mdx)"
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-controls",
    "@storybook/addon-actions",
    "@storybook/addon-backgrounds",
    "@storybook/addon-measure",
    "@storybook/addon-outline",
    "@storybook/addon-toolbars",
    "@storybook/addon-viewport",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    // '@storybook/addon-essentials',
    // '@storybook/addon-viewport',
    // "@chromatic-com/storybook"
    // "@storybook/addon-styling" // optionnel pour gérer globalement PostCSS/CSS-in-JS
  ],
  staticDirs: ["../public"]
};
export default config;
