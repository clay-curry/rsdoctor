import path from 'path';
import { JsxEmit, ScriptTarget } from 'typescript';
import type { StorybookConfig } from '@storybook/react-webpack5';

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
    check: false,
    skipCompiler: true,
  },
  webpack: async (config) => {
    config.stats = 'verbose';

    if (config.module?.rules) {
      config.module.rules = [
        ...config.module.rules,
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.module\.s(a|c)ss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.s(a|c)ss$/,
          exclude: /\.module\.(s(a|c)ss)$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ];
    }

    if (config.resolve?.fallback) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        zlib: require.resolve('browserify-zlib'),
        tty: require.resolve('tty-browserify'),
      };
    }

    if (config.resolve?.extensions) {
      config.resolve.extensions.concat([
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.md',
        '.mdx',
      ]);
    }

    if (config.plugins) {
      config.plugins.push(
        new RewriteModuleSpecifierPlugin([
          {
            issuer: path.resolve(
              __dirname,
              '../src/components/Layout/header.tsx',
            ),
            specifier: path.resolve(__dirname, '../src/components/Alerts'),
            resolution: path.resolve(
              __dirname,
              '../__mocks__/Header/Alerts.tsx',
            ),
          },
          {
            issuer: path.resolve(
              __dirname,
              '../src/components/Layout/header.tsx',
            ),
            specifier: path.resolve(
              __dirname,
              '../src/components/Layout/builder-select',
            ),
            resolution: path.resolve(
              __dirname,
              '../__mocks__/Header/builder-select.tsx',
            ),
          },
          {
            issuer: path.resolve(
              __dirname,
              '../src/components/Layout/header.tsx',
            ),
            specifier: path.resolve(__dirname, '../src/components/Manifest'),
            resolution: path.resolve(
              __dirname,
              '../__mocks__/Header/Manifest.tsx',
            ),
          },
          {
            issuer: path.resolve(
              __dirname,
              '../src/components/Layout/menus.tsx',
            ),
            specifier: path.resolve(__dirname, '../src/components/Manifest'),
            resolution: path.resolve(
              __dirname,
              '../__mocks__/Header/Manifest.tsx',
            ),
          },
          {
            issuer: path.resolve(
              __dirname,
              '../src/components/Layout/header.tsx',
            ),
            specifier: path.resolve(
              __dirname,
              '../src/components/Layout/menus',
            ),
            resolution: path.resolve(
              __dirname,
              '../__mocks__/Header/menus.tsx',
            ),
          },
          {
            issuer: path.resolve(
              __dirname,
              '../src/components/Layout/header.tsx',
            ),
            specifier: path.resolve(__dirname, '../src/components/utils'),
            resolution: path.resolve(__dirname, '../__mocks__/Header/utils.ts'),
          },
          {
            issuer: path.resolve(
              __dirname,
              '../src/components/Layout/menus.tsx',
            ),
            specifier: path.resolve(__dirname, '../src/components/utils'),
            resolution: path.resolve(__dirname, '../__mocks__/Header/utils.ts'),
          },
        ]),
      );
    }

    return config;
  },
};

export default config;

class RewriteModuleSpecifierPlugin {
  rewrites: Array<{ issuer: string; specifier: string; resolution: string }>;

  constructor(
    rewrites: { issuer: string; specifier: string; resolution: string }[],
  ) {
    this.rewrites = Array.from(rewrites);
  }

  apply(compiler) {
    const rewrites = this.rewrites;
    // once the normal module factory is created, we can tap into the module hook
    compiler.resolverFactory.hooks.resolver
      .for('normal')
      .tap('RewriteModuleFactoryPlugin', (resolver) => {
        resolver.hooks.result.tap('RewriteModuleResolverPlugin', (result) => {
          const alias = rewrites
            .filter(({ issuer }) => result.context.issuer === issuer)
            .filter(({ specifier }) => result.__innerRequest === specifier)
            .map(({ resolution }) => ({ resolution }))
            .pop();

          return alias || result;
        });
      });
  }
}
