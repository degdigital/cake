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
  bindEvents();
  checkEnvVarsAreSet();
  checkLocalFeatureEnvironment();
  spaceId = getSpaceId(envVars);
  varsString = `--access-token ${envVars.accessToken} --space-id ${envVars.spaceId} --environment-id ${envVars.environmentId}`;
  try {
    const inited = await initMigration();
    if (inited) {
      logMigrationTypeInited();
    }
  } catch (error) {
    logMigrationTypeInited();
  }

  try {
    console.log('Beginning migration dry run');
    await runDryRun();
  } catch (error) {
    console.log(`Dry Run Migration Error: ${error}`);
    process.exit(1);
  }
  try {
    console.log('Beginning migration');
    await runMigration();
  } catch (error) {
    console.log(`Run Migration Error: ${error}`);
    process.exit(1);
  }
};

const bindEvents = () => {
  process.on('uncaughtException', error => {
    console.error(error);
    process.exit(1);
  });
};

const checkEnvVarsAreSet = () => {
  const envVarsAreSet = validateEnvVars(envVars);
  if (!envVarsAreSet) {
    console.log(
      `contentful-migrate: at least one environmental variable is missing: ${envVars}`
    );
    process.exit(1);
  }
};

const checkLocalFeatureEnvironment = () => {
  if (
    process.env.NODE_ENV !== 'production' &&
    ['master', 'staging', 'qa'].includes(envVars.environmentId)
  ) {
    console.log(
      'Migration scripts should be tested locally on a feature environment (not directly on qa, staging or master). Type `npm run create-contentful-loyalty-environment --name="[NEW ENVIRONMENT NAME]"` to create one.'
    );
    process.exit(1);
  }
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

const runDryRun = async () => await runMigration(true);

const runMigration = (dryRun = false) =>
  new Promise((resolve, reject) => {
    const dryRunFlag = dryRun ? ` --dry-run=true` : ``;
    const cliCommand = `ctf-migrate up ${varsString} --all${dryRunFlag}`;
    exec(cliCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      if (stderr) {
        console.log(stderr);
        reject(stderr);
      }
      console.log(stdout);
      resolve();
    });
  });

init();
