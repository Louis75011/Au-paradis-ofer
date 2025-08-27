import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  framework: { name: '@storybook/nextjs', options: {} },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-backgrounds',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
    '@storybook/addon-toolbars',
    '@storybook/addon-viewport',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    // '@chromatic-com/storybook' si besoin
  ],
  staticDirs: ['../public'],
};

export default config;
