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
                configFile: path.resolve(
                  __dirname,
                  '../tsconfig.storybook.json',
                ),
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.(jpg|png|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 25000,
          },
        },
        {
          test: /\.(jpg|png|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[path][name].[hash].[ext]',
          },
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
        os: require.resolve('os-browserify/browser'),
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
            specifier: path.resolve(
              __dirname,
              '../src/components/Alerts/index.tsx',
            ),
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
              '../src/components/Layout/builder-select.tsx',
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
            specifier: path.resolve(
              __dirname,
              '../src/components/Manifest/index.tsx',
            ),
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
              '../src/components/Layout/menus/index.tsx',
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
            specifier: path.resolve(
              __dirname,
              '../src/components/utils/index.ts',
            ),
            resolution: path.resolve(__dirname, '../__mocks__/Header/utils.ts'),
          },
          {
            issuer: path.resolve(
              __dirname,
              '../src/components/Layout/menus.tsx',
            ),
            specifier: path.resolve(
              __dirname,
              '../src/components/Manifest/index.tsx',
            ),
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
            specifier: path.resolve(
              __dirname,
              '../src/components/utils/index.ts',
            ),
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
    // once the normal module factory is created, we can tap into the module hook
    compiler.resolverFactory.hooks.resolver
      .for('normal')
      .tap('RewriteModuleFactoryPlugin', (resolver) => {
        resolver.hooks.result.tap('RewriteModuleResolverPlugin', (result) => {
          const issuerRules = this.rewrites.filter(
            ({ issuer }) => result.context.issuer === issuer,
          );
          const specifierRules = issuerRules.filter(
            ({ specifier }) => result.path === specifier,
          );
          if (specifierRules.length === 0) return result;

          const alias = specifierRules
            .map(({ resolution }) => resolution)
            .pop();
          result.path = alias;
          result.relativePath = './'.concat(
            path.relative(path.join(__dirname, '..'), alias),
          );
          result.__innerRequest = result.relativePath;
          result.__innerRequest_relativePath = result.relativePath;
          return result;
        });
      });
  }
}
