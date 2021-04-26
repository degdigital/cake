#!/usr/bin/env node
'use strict';
const program = require('commander');
const install = require('../lib/install');

program.version('1.0.0');
program
  .command('install <projectName>')
  .description('Install a new Cake project')
  .action(install)
  .allowExcessArguments(false);

program.parse(process.argv);
