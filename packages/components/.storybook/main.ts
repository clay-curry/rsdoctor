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
    reactDocgenTypescriptOptions: {
      include: ['../src/stories/**/*.ts', '../src/stories/**/*.tsx'],
      compilerOptions: {
        target: ScriptTarget.ESNext,
        jsx: JsxEmit.ReactJSX,
        allowSyntheticDefaultImports: true,
      },
    },
  },
  webpack: async (config) => {
    if (config.module?.rules) {
      config.module.rules.push({
        // Replaces existing CSS rules to support PostCSS
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      });
      config.module.rules.push({
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              api: 'modern',
            },
          },
        ],
      });
      config.module.rules.push({
        test: /\.less$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: { implementation: require.resolve('less') },
          },
        ],
      });
    }

    if (config.resolve?.extensionAlias) {
      config.resolve.extensionAlias = {
        '.scss': ['sass'],
        '.sass': ['scss'],
        '.less': ['css'],
      };
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
    // once the normal module factory is created, we can tap into the module hook
    compiler.hooks.normalModuleFactory.tap(
      'RewriteModuleSpecifierPlugin',
      (nmf) => {
        nmf.hooks.beforeResolve.tap(
          'NormalModuleReplacementPlugin',
          (result) => {
            const rewriteRules = this.rewrites.filter(
              ({ issuer }) => issuer === result.contextInfo.issuer,
            );
            if (rewriteRules.length === 0) return;

            const moduleSpecifier = path.resolve(
              result.contextInfo.issuer,
              result.request,
            );
            const moduleResolution = rewriteRules.filter(
              ({ specifier }) => specifier === moduleSpecifier,
            );
            if (moduleResolution.length > 0)
              result.request = moduleResolution[0].resolution;
          },
        );

        nmf.hooks.afterResolve.tap(
          'NormalModuleReplacementPlugin',
          (result) => {
            const issuerRules = this.rewrites.filter(
              ({ issuer }) => issuer === result.contextInfo.issuer,
            );
            if (issuerRules.length === 0) return;

            const specifierRewriteRules = issuerRules.filter(({ specifier }) =>
              result.createData.resource.includes(specifier),
            );
            if (specifierRewriteRules.length === 0) return;

            const fs = compiler.inputFileSystem;
            const moduleResolution = specifierRewriteRules[0].resolution;
            result.createData.resource = join(
              fs,
              dirname(fs, result.createData.resource),
              moduleResolution,
            );
          },
        );
      },
    );
  }
}

const dirname = (fs, absPath) => {
  if (fs && fs.dirname) {
    return fs.dirname(absPath);
  }
  if (path.posix.isAbsolute(absPath)) {
    return path.posix.dirname(absPath);
  }
  if (path.win32.isAbsolute(absPath)) {
    return path.win32.dirname(absPath);
  }
  throw new Error(
    `${absPath} is neither a posix nor a windows path, and there is no 'dirname' method defined in the file system`,
  );
};

const join = (fs, rootPath, filename) => {
  if (fs && fs.join) {
    return fs.join(rootPath, filename);
  }
  if (path.posix.isAbsolute(rootPath)) {
    return path.posix.join(rootPath, filename);
  }
  if (path.win32.isAbsolute(rootPath)) {
    return path.win32.join(rootPath, filename);
  }
  throw new Error(
    `${rootPath} is neither a posix nor a windows path, and there is no 'join' method defined in the file system`,
  );
};
