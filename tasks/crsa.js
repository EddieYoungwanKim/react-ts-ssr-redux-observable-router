#!/usr/bin/env node
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const chalk = require('chalk');
const path = require('path');
const cp = require('child_process');
const fs = require('fs-extra');
const os = require('os');
const spawn = require('cross-spawn');
const execSync = require('child_process').execSync;

const handleExit = () => {
  console.log('Exiting without error.');
  process.exit();
};

const handleError = e => {
  console.error('ERROR! An error was encountered while executing');
  console.error(e);
  console.log('Exiting with error.');
  process.exit(1);
};

process.on('SIGINT', handleExit);
process.on('uncaughtException', handleError);

cp.execSync('yarn cache clean');

const args = process.argv.slice(2);
const projectName = args[0];

if (typeof projectName === 'undefined') {
  console.error('Please specify the project directory:');
  console.log();
  process.exit(1);
}

const appRoot = path.resolve(projectName);
const appName = path.basename(appRoot);
fs.ensureDirSync(projectName);

console.log(`Creating a new app in ${chalk.green(appRoot)}.`);
console.log();

const packageJson = {
  name: appName,
  version: '0.1.0',
  private: true,
};
fs.writeFileSync(
  path.join(appRoot, 'package.json'),
  JSON.stringify(packageJson, null, 2) + os.EOL
);

if (!shouldUseYarn()) {
  console.log(chalk.red(`Please Use Yarn.\n`));
  process.exit(1);
}

// Change working directory
process.chdir(appRoot);

const allDependencies = [
  'escape-string-regexp',
  'express',
  'react',
  'react-dom',
  '@eddie/scripts@1.0.0',
  '@types/express',
  '@types/jest',
  '@types/node',
  '@types/react',
  '@types/react-dom',
  '@types/webpack-env',
  'typescript',
];
console.log('Installing packages. This might take a couple of minutes.');
console.log(
  `Installing ${chalk.cyan('express')}, ${chalk.cyan('react')}, ${chalk.cyan(
    'react-dom'
  )}, and ${chalk.cyan('@eddie/scripts@1.0.0')}...`
);
console.log();

install(appRoot, allDependencies)
  .then(async () => {
    // Add npm scripts with our custom scripts
    // Add eslintConfig with extending 'react-app'
    // Add browserlist with default list
    // Copy template over to the appPath
    // gitignore to .gitignore
    // Install additional template dependencies from .template.dependencies.json
    // VerifyTypeScriptSetup
    // Create tsconfig.json and global.d.ts
    await executeNodeScript(
      {
        cwd: process.cwd(),
        args: [],
      },
      [appRoot, appName],
      `
    var init = require('@eddie/scripts/scripts/init.js');
    init.apply(null, JSON.parse(process.argv[1]));
  `
    );
    // Cleanup
    handleExit();
  })
  .catch(reason => {
    console.log();
    console.log('Aborting installation.');
    if (reason.command) {
      console.log(`  ${chalk.cyan(reason.command)} has failed.`);
    } else {
      console.log(chalk.red('Unexpected error. Please report it as a bug:'));
      console.log(reason);
    }
    console.log();
    handleError();
  });

function executeNodeScript({ cwd, args }, data, source) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [...args, '-e', source, '--', JSON.stringify(data)],
      { cwd, stdio: 'inherit' }
    );

    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `node ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}

function install(root, dependencies) {
  return new Promise((resolve, reject) => {
    let command;
    let args;
    command = 'yarnpkg';
    args = ['add', '--exact'];
    [].push.apply(args, dependencies);
    args.push('--cwd');
    args.push(root);

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}
