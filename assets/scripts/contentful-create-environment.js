const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
const { validateEnvVars } = require('./utils.js');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.local')
  });
  const envVars = {
    spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    newEnvironmentName: process.env.NAME,
    cloneEnvironmentName: process.env.SOURCE || 'develop',
    accessToken: process.env.CONTENTFUL_PERSONAL_ACCESS_TOKEN
  };
  let newEnvironmentName;
  let cloneEnvironmentName;

  const init = async () => {
    const envVarsAreSet = validateEnvVars(envVars);
    if (!envVarsAreSet) {
      console.log(
        `contentful-create-environment: at least one environmental variable is missing.`
      );
      console.log(envVars);
      return;
    }
    newEnvironmentName = slugify(envVars.newEnvironmentName);
    cloneEnvironmentName = slugify(envVars.cloneEnvironmentName);
    await createSpace();
    updateEnvVarFile();
  };

  const createSpace = () =>
    new Promise((resolve, reject) => {
      const cliCommand = `contentful space environment create --space-id=${envVars.spaceId} --name ${newEnvironmentName} --environment-id ${newEnvironmentName} --source ${cloneEnvironmentName}`;
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

  const updateEnvVarFile = () => {
    const envFilePath = path.resolve(process.cwd(), '.env.local');
    fs.readFile(envFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const regex = /NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT=.*$/im;
      const newData = data.replace(
        regex,
        `NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT=${newEnvironmentName}`
      );

      fs.writeFile(envFilePath, newData, err => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(
          `Environmental variable NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT successfully updated to ${newEnvironmentName} in .env.local`
        );
      });
    });
  };

  init();
}
