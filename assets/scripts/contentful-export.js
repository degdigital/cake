const { exec } = require('child_process');
const path = require('path');
require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.local')
});
const { validateEnvVars } = require('./utils.js');

const envVars = {
  spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT
};

const init = async () => {
  const envVarsAreSet = validateEnvVars(envVars);
  if (!envVarsAreSet) {
    console.log(
      `contentful-export: at least one environmental variable is missing.`
    );
    console.log(envVars);
    return;
  }
  await runExport();
};

const runExport = () =>
  new Promise((resolve, reject) => {
    const cliCommand = `contentful space export --space-id ${envVars.spaceId} --environment-id ${envVars.environment}`;
    exec(cliCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        reject();
      }
      if (stderr) {
        console.log(stderr);
        reject();
      }
      console.log(stdout);
      resolve();
    });
  });

init();
