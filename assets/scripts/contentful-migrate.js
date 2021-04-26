const fs = require('fs');
const path = require('path');
const { runMigration } = require('contentful-migration');
const { validateEnvVars } = require('./utils.js');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.local')
  });
}

const scriptsFolder = './migrations';
let envVars = {
  spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  environmentId: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
  accessToken: process.env.CONTENTFUL_PERSONAL_ACCESS_TOKEN
};
let filePaths;
let options;

const init = () => {
  const envVarsAreSet = validateEnvVars(envVars);
  if (!envVarsAreSet) {
    console.log(
      `contentful-migrate: at least one environmental variable is missing.`
    );
    console.log(envVars);
    return;
  }
  filePaths = getFilePaths();
  options = {
    spaceId: envVars.spaceId,
    environmentId: envVars.environmentId,
    accessToken: envVars.accessToken,
    yes: process.env.NODE_ENV === 'production' // bypasses prompt on CI/CD
  };
  runMigrations(filePaths);
};

const runMigrations = async filePaths => {
  for (const filePath of filePaths) {
    try {
      await runMigration({
        ...options,
        filePath
      });
      console.log('Migration done!');
    } catch (e) {
      console.error(e);
    }
  }
};

const getFilePaths = () => {
  const filterNonFiles = file => file.endsWith('.js');
  const rawDirectoryContents = fs.readdirSync(`${scriptsFolder}`);
  const filePaths = rawDirectoryContents
    .filter(filterNonFiles)
    .map(file => path.resolve(process.cwd(), `${scriptsFolder}/${file}`));
  return filePaths;
};

init();
