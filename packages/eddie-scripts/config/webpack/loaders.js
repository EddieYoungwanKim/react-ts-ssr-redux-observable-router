// @remove-on-eject-begin
/**
 * Copyright (c) 2019-present, Trustwork
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('@eddie/dev-utils/getCSSModuleLocalIdent');
// @remove-on-eject-begin
const getCacheIdentifier = require('@eddie/dev-utils/getCacheIdentifier');
// @remove-on-eject-end
const postcssNormalize = require('postcss-normalize');

const paths = require('../paths');

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const baseLoaders = (webpackEnv, appEnv) => {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const isEnvServer = appEnv === 'server';

  return [
    // Process application JS with Babel.
    // The preset includes JSX, Flow, TypeScript, and some ESnext features.
    {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: paths.appSrc,
      loader: require.resolve('babel-loader'),
      options: {
        customize: require.resolve('babel-preset-react-app/webpack-overrides'),
        // @remove-on-eject-begin
        babelrc: false,
        configFile: false,
        presets: [require.resolve('babel-preset-react-app')],
        // Make sure we have a unique cache identifier, erring on the
        // side of caution.
        // We remove this when the user ejects because the default
        // is sane and uses Babel options. Instead of options, we use
        // the react-scripts and babel-preset-react-app versions.
        cacheIdentifier: getCacheIdentifier(
          isEnvProduction ? 'production' : isEnvDevelopment && 'development',
          [
            'babel-plugin-styled-components',
            'babel-plugin-named-asset-import',
            'babel-preset-react-app',
            '@eddie/dev-utils',
            '@eddie/scripts',
          ]
        ),
        // @remove-on-eject-end
        plugins: [
          // Add support for styled-components ssr
          require.resolve('babel-plugin-styled-components'),
          // Transform dynamic import to require for server
          isEnvServer && require.resolve('babel-plugin-dynamic-import-node'),
          [
            require.resolve('babel-plugin-named-asset-import'),
            {
              loaderMap: {
                svg: {
                  ReactComponent: '@svgr/webpack?-svgo,+ref![path]',
                },
              },
            },
          ],
          '@loadable/babel-plugin',
        ].filter(Boolean),
        // This is a feature of `babel-loader` for webpack (not Babel itself).
        // It enables caching results in ./node_modules/.cache/babel-loader/
        // directory for faster rebuilds.
        cacheDirectory: true,
        cacheCompression: isEnvProduction,
        compact: isEnvProduction,
      },
    },
    // Process any JS outside of the app with Babel.
    // Unlike the application JS, we only compile the standard ES features.
    {
      test: /\.(js|mjs)$/,
      exclude: /@babel(?:\/|\\{1,2})runtime/,
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: false,
        configFile: false,
        compact: false,
        presets: [
          [
            require.resolve('babel-preset-react-app/dependencies'),
            { helpers: true },
          ],
        ],
        cacheDirectory: true,
        cacheCompression: isEnvProduction,
        // @remove-on-eject-begin
        cacheIdentifier: getCacheIdentifier(
          isEnvProduction ? 'production' : isEnvDevelopment && 'development',
          [
            'babel-plugin-styled-components',
            'babel-plugin-named-asset-import',
            'babel-preset-react-app',
            '@eddie/dev-utils',
            '@eddie/scripts',
          ]
        ),
        // @remove-on-eject-end
        // If an error happens in a package, it's possible to be
        // because it was compiled. Thus, we don't want the browser
        // debugger to show the original code. Instead, the code
        // being evaluated would be much more helpful.
        sourceMaps: false,
      },
    },
  ];
};

const clientLoaders = webpackEnv => {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  // Webpack uses `publicPath` to determine where the app is being served from.
  // It requires a trailing slash, or the file assets will get an incorrect path.
  // In development, we always serve from the root. This makes config easier.
  const publicPath = isEnvProduction
    ? paths.servedPath
    : isEnvDevelopment && '/';
  // Some apps do not use client-side routing with pushState.
  // For these, "homepage" can be set to "." to enable relative asset paths.
  const shouldUseRelativeAssetPaths = publicPath === './';

  // common function to get style loaders
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: Object.assign(
          {},
          shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
        ),
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            // Adds PostCSS Normalize as the reset css with default options,
            // so that it honors browserslist config in package.json
            // which in turn let's users customize the target behavior as per their needs.
            postcssNormalize(),
          ],
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      });
    }
    return loaders;
  };

  return [
    // "url" loader works like "file" loader except that it embeds assets
    // smaller than specified limit in bytes as data URLs to avoid requests.
    // A missing `test` is equivalent to a match.
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
    // "postcss" loader applies autoprefixer to our CSS.
    // "css" loader resolves paths in CSS and adds assets as dependencies.
    // "style" loader turns CSS into JS modules that inject <style> tags.
    // In production, we use MiniCSSExtractPlugin to extract that CSS
    // to a file, but in development "style" loader enables hot editing
    // of CSS.
    // By default we support CSS Modules with the extension .module.css
    {
      test: cssRegex,
      exclude: cssModuleRegex,
      use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: isEnvProduction && shouldUseSourceMap,
      }),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    },
    // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
    // using the extension .module.css
    {
      test: cssModuleRegex,
      use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: isEnvProduction && shouldUseSourceMap,
        modules: true,
        getLocalIdent: getCSSModuleLocalIdent,
      }),
    },
    // Opt-in support for SASS (using .scss or .sass extensions).
    // By default we support SASS Modules with the
    // extensions .module.scss or .module.sass
    {
      test: sassRegex,
      exclude: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 2,
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
        'sass-loader'
      ),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    },
    // Adds support for CSS Modules, but using SASS
    // using the extension .module.scss or .module.sass
    {
      test: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 2,
          sourceMap: isEnvProduction && shouldUseSourceMap,
          modules: true,
          getLocalIdent: getCSSModuleLocalIdent,
        },
        'sass-loader'
      ),
    },
    // "file" loader makes sure those assets get served by WebpackDevServer.
    // When you `import` an asset, you get its (virtual) filename.
    // In production, they would get copied to the `build` folder.
    // This loader doesn't use a "test" so it will catch all modules
    // that fall through the other loaders.
    {
      loader: require.resolve('file-loader'),
      // Exclude `js` files to keep "css" loader working as it injects
      // its runtime that would otherwise be processed through "file" loader.
      // Also exclude `html` and `json` extensions so they get processed
      // by webpacks internal loaders.
      exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
      options: {
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
  ];
};

const serverLoaders = () => {
  // common function to get style loaders
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
          ],
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
      });
    }
    return loaders;
  };

  return [
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
    {
      test: cssRegex,
      exclude: cssModuleRegex,
      loader: require.resolve('css-loader'),
    },
    {
      test: cssModuleRegex,
      use: getStyleLoaders({
        importLoaders: 1,
        modules: true,
        getLocalIdent: getCSSModuleLocalIdent,
      }),
    },
    {
      test: sassRegex,
      exclude: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 2,
        },
        'sass-loader'
      ),
      sideEffects: true,
    },
    {
      test: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 2,
          modules: true,
          getLocalIdent: getCSSModuleLocalIdent,
        },
        'sass-loader'
      ),
    },
    {
      loader: require.resolve('file-loader'),
      exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
      options: {
        name: 'static/media/[name].[hash:8].[ext]',
        emitFile: false,
      },
    },
  ];
};

module.exports = function(webpackEnv, appEnv) {
  return {
    client: [...baseLoaders(webpackEnv, appEnv), ...clientLoaders(webpackEnv)],
    server: [...baseLoaders(webpackEnv, appEnv), ...serverLoaders(webpackEnv)],
  };
};
