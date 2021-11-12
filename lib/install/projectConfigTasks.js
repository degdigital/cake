const fs = require('fs-extra');
const path = require('path');

const projectConfigTasks = (projectName, answers) =>
  new Promise(resolve => {
    const cwd = process.cwd();
    const sourceDirectoryPath = path.join(__dirname, '../../assets');
    const destinationDirectoryPath = `${cwd}/${projectName}`;
    const { deliveryToken, createEnvironments, accessToken, spaceId } = answers;

    const init = () => {
      copySourceFiles();
      createEnvFile();
      updatePackageFile();
      resolve();
    };

    const copySourceFiles = async () => {
      const itemsToCopy = [
        '.plop',
        'plopfile.js',
        'components/ContentPreviewWidget',
        'migration-sample',
        'scripts',
        'utils',
        'pages',
        'graphql',
        '.vscode/contentful.code-snippets'
      ];
      for (const item of itemsToCopy) {
        await fs.copy(
          `${sourceDirectoryPath}/${item}`,
          `${destinationDirectoryPath}/${item}`
        );
      }
    };

    const createEnvFile = async () => {
      const contents = `# Contentful Personal Access Token (Private)
CONTENTFUL_PERSONAL_ACCESS_TOKEN=${accessToken}

# Contentful (Public)
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=${spaceId}
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT=${createEnvironments ? 'qa' : 'master'}
NEXT_PUBLIC_CONTENTFUL_DELIVERY_ACCESS_TOKEN=${deliveryToken}
NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN=`;
      await fs.outputFile(`${cwd}/${projectName}/.env.local`, contents);
    };

    const updatePackageFile = async () => {
      const packageObj = await fs.readJson(
        `${cwd}/${projectName}/package.json`
      );
      const newPackageObj = {
        ...packageObj,
        scripts: {
          ...packageObj.scripts,
          build: 'npm run migrate-contentful && next build && next export',
          'build-storybook': 'build-storybook',
          'create-contentful-environment':
            'NAME=$npm_config_name node scripts/contentful-create-environment.js',
          'ctf-migrate': 'ctf-migrate',
          'export-contentful': 'node scripts/contentful-export.js',
          'migrate-contentful': 'node scripts/contentful-migrate.js'
        },
        dependencies: {
          ...packageObj.dependencies,
          '@contentful/rich-text-html-renderer': '^14.1.2',
          '@contentful/rich-text-react-renderer': '^14.1.2',
          '@contentful/rich-text-types': '^14.1.2',
          contentful: '^8.2.1'
        },
        devDependencies: {
          ...packageObj.devDependencies,
          'contentful-cli': '^1.5.33',
          'contentful-migration': '^4.0.8',
          dateformat: '^3.0.3',
          dotenv: '^8.2.0',
          eslint: '^6.8.0',
          graphql: '^15.4.0',
          slugify: '^1.4.7',
          'storybook-css-modules-preset': '^1.0.6'
        }
      };
      const formattedJson = JSON.stringify(newPackageObj, null, 2);
      await fs.outputFile(`${cwd}/${projectName}/package.json`, formattedJson);
    };

    init();
  });

module.exports = projectConfigTasks;
