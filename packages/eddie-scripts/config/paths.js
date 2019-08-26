// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appDist: resolveApp('dist'),
  appDistPublic: resolveApp('dist/public'),
  appBuild: resolveApp('build'),
  appBuildPublic: resolveApp('build/public'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/app.html'),
  appClientIndexJs: resolveModule(resolveApp, 'src/entry/client/index'),
  appServerIndexJs: resolveModule(resolveApp, 'src/entry/server/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  appNodeModules: resolveApp('node_modules'),
  // These properties only exist before ejecting:
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'), // This is empty on npm 3
  appTypeDeclarations: resolveApp('src/global.d.ts'),
  ownTypeDeclarations: resolveOwn('lib/react-app.d.ts'),
};

module.exports.moduleFileExtensions = moduleFileExtensions;
