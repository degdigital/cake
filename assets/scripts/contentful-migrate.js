const { exec } = require('child_process');
const path = require('path');
const { validateEnvVars } = require('./utils.js');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.local')
  });
}

let envVars = {
  spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  environmentId: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
  accessToken: process.env.CONTENTFUL_PERSONAL_ACCESS_TOKEN
};
let varsString;

const init = () => {
  const envVarsAreSet = validateEnvVars(envVars);
  if (!envVarsAreSet) {
    console.log(
      `contentful-migrate: at least one environmental variable is missing.`
    );
    console.log(envVars);
    return;
  }
  varsString = `--access-token ${envVars.accessToken} --space-id ${envVars.spaceId} --environment-id ${envVars.environmentId}`;
  const inited = await initMigration().catch(logMigrationTypeInited);
  if (inited) {
    logMigrationTypeInited();
  }
  await runMigration().catch(error =>
    console.log('Run Migration Error: ', error)
  );
};

const logMigrationTypeInited = () =>
  console.log(`Migration content type ready on ${envVars.environmentId}.`);

const initMigration = () =>
  new Promise((resolve, reject) => {
    const cliCommand = `ctf-migrate init ${varsString}`;
    exec(cliCommand, (error, stdout, stderr) => {
      if (error || stderr) {
        reject();
      }
      console.log(stdout);
      resolve();
    });
  });

const runMigration = () =>
  new Promise((resolve, reject) => {
    const cliCommand = `ctf-migrate up ${varsString} --all`;
    exec(cliCommand, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stderr) {
        reject(stderr);
      }
      console.log(stdout);
      resolve();
    });
  });

init();
