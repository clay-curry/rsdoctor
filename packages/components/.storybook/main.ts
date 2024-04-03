import type { StorybookConfig } from '@storybook/react-webpack5';
import { JsxEmit, ScriptTarget } from 'typescript';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgenTypescriptOptions: {
      include: ['../src/stories/**/*.ts', '../src/stories/**/*.tsx'],
      compilerOptions: {
        target: ScriptTarget.ESNext,
        jsx: JsxEmit.ReactJSX,
        allowSyntheticDefaultImports: true,
      },
    },
  },
};
export default config;
