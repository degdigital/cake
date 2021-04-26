const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const contentfulManagement = require('contentful-management');
const contentfulImport = require('contentful-import');

const contentfulTasks = projectName =>
  new Promise(resolve => {
    let client = null;
    let orgs = [];
    let state = {};

    const init = async () => {
      showIntro();
      await promptForAccessToken();

      createClient(state.accessToken);
      await getOrgs();
      await promptRemainingQuestions();
      await createSpace();
      await createAccessToken();
      await importStarterModel();
      await createEnvironments();
      await updateAccessTokenPermissions();
      resolve(state);
    };

    const showIntro = () => {
      console.log(
        `First, let's set up your Contentful space.

You'll need a Contentful Personal Access Token to continue. Visit ${chalk.cyan(
          `https://shorturl.at/uwMQS`
        )} if you need help creating one.

  `
      );
    };

    const promptForAccessToken = async () =>
      await inquirer
        .prompt([
          {
            name: 'personalAccessToken',
            type: 'input',
            message: `Please enter your access token:`,
            validate: val =>
              val.length > 0 ? true : 'Please enter an access token.'
          }
        ])
        .then(answers => {
          state.accessToken = answers.personalAccessToken;
        });

    const createClient = accessToken => {
      if (!client) {
        client = contentfulManagement.createClient({ accessToken });
      }
    };

    const getOrgs = async () =>
      client
        .getOrganizations()
        .then(response => {
          orgs = response.items.map(item => ({
            name: item.name,
            value: item.sys.id
          }));
        })
        .catch(console.error);

    const promptRemainingQuestions = async () =>
      await inquirer
        .prompt([
          {
            name: 'confirmedProjectName',
            type: 'input',
            message: `What is the name of your Contentful space?`,
            default: projectName
          },
          {
            name: 'selectedOrg',
            type: 'list',
            message: `In which organization would you like to add your Contentful space?`,
            choices: orgs
          },
          {
            name: 'createEnvironments',
            type: 'confirm',
            message: `Do you want to create multiple Contentful environments? (i.e. master, staging, qa, develop?)`
          }
        ])
        .then(answers => {
          state = {
            ...state,
            ...answers
          };
        });

    const createSpace = () =>
      client
        .createSpace(
          {
            name: state.confirmedProjectName
          },
          state.selectedOrg
        )
        .then(space => {
          const spaceId = space.sys.id;
          console.log(
            `Your new Contentful space (${spaceId}) has been successfully created.`
          );
          state.spaceId = spaceId;
        })
        .catch('create error', console.error);

    const createAccessToken = () =>
      new Promise(async resolve => {
        const space = await client.getSpace(state.spaceId);
        await space
          .createApiKey({
            name: 'Primary API Key'
          })
          .then(response => {
            state.apiKeyId = response.sys.id;
            state.deliveryToken = response.accessToken;
          });
        resolve();
      });

    const updateAccessTokenPermissions = () =>
      new Promise(async resolve => {
        if (state.createEnvironments === false) {
          resolve();
        } else {
          const space = await client.getSpace(state.spaceId);
          const apiKey = await space.getApiKey(state.apiKeyId);
          const envs = ['master', 'staging', 'qa', 'develop'];
          apiKey.environments = envs.map(id => ({
            sys: {
              type: 'Link',
              linkType: 'Environment',
              id
            }
          }));
          await apiKey.update();
          resolve();
        }
      });

    const importStarterModel = () => {
      const options = {
        contentFile: path.join(
          __dirname,
          '../../models/general-purpose-model.json'
        ),
        spaceId: state.spaceId,
        managementToken: state.accessToken
      };

      return contentfulImport(options).catch(error => console.log(error));
    };

    const createEnvironments = () =>
      new Promise(async (resolve, reject) => {
        if (state.createEnvironments) {
          const space = await client.getSpace(state.spaceId);
          await space.createEnvironmentWithId('staging', { name: 'Staging' });
          await space.createEnvironmentWithId('qa', { name: 'QA' });
          await space.createEnvironmentWithId('develop', { name: 'Develop' });
          console.log('All Contentful environments successfully created');
        }
        resolve();
      });

    init();
  });

module.exports = contentfulTasks;
