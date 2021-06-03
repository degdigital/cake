const fs = require('fs');
const dateformat = require('dateformat');

const migrationGenerator = (plop, { basePath }) => {
  const migrationsDir = `./migrations`;
  const templatePath = `${basePath}/Migration`;
  const createTemplateFilename = 'CreateMigration.js.hbs';
  const editTemplateFilename = 'EditMigration.js.hbs';
  const outputPath = `migrations`;
  const createNewDirectoryOption = '[Create a new subdirectory]';
  let migrationsDirIsMissing = true;
  let migrationsDirIsEmpty = true;

  const getMigrationDirectoryContents = () => {
    try {
      if (fs.existsSync(migrationsDir)) {
        migrationsDirIsMissing = false;
      }
      const rawDirContents = fs
        .readdirSync(migrationsDir)
        .filter(item => !item.startsWith('.'));
      migrationsDirIsEmpty = false;
      return rawDirContents;
    } catch (error) {
      // console.log(error);
      return [];
    }
  };

  const rawDirContents = getMigrationDirectoryContents();
  const migrationChoices = [createNewDirectoryOption, ...rawDirContents];

  plop.setGenerator('migration', {
    description: 'Create a new Contentful migration script',
    prompts: [
      {
        type: 'list',
        name: 'directory',
        when: !migrationsDirIsEmpty,
        validate: input =>
          input.length !== 0 ? true : 'Please choose or create a directory.',
        message: `Where should your migration script be saved?`,
        choices: migrationChoices,
        loop: false
      },
      {
        type: 'input',
        name: 'newDirectoryName',
        when: answers =>
          migrationsDirIsEmpty === true ||
          answers.directory === createNewDirectoryOption,
        filter: input => plop.renderString('{{camelCase input}}', { input }),
        validate: input =>
          input.length !== 0
            ? true
            : `Please give a name for your script's subdirectory.`,
        message: migrationsDirIsEmpty
          ? `What's the name of the migrations subdirectory where your script will live?`
          : `What's the name of the new subdirectory?`
      },
      {
        type: 'input',
        name: 'name',
        default: answers =>
          nswers.directory !== createNewDirectoryOption
            ? plop.renderString('{{titleCase directory}}', answers)
            : plop.renderString('{{titleCase newDirectoryName}}', answers),
        validate: input =>
          input.length !== 0 ? true : 'Please give your content type a name.',
        message: `What's the name of your content type? (i.e., "Page Metadata")`
      },
      {
        type: 'list',
        name: 'scriptType',
        message: `What's the purpose of this migration?`,
        choices: [
          {
            name: `I'm creating a new content type`,
            value: 'create'
          },
          {
            name: `I'm editing an existing content type`,
            value: 'edit'
          }
        ]
      }
    ],
    actions: data => {
      if (migrationsDirIsMissing) {
        fs.mkdirSync(migrationsDir);
      }
      const subdirectoryPath =
        migrationsDirIsEmpty || data.directory === createNewDirectoryOption
          ? data.newDirectoryName
          : data.directory;
      const date = dateformat(new Date(), 'UTC:yyyymmddHHMMss');
      const fileName =
        data.scriptType === 'create'
          ? createTemplateFilename
          : editTemplateFilename;
      return [
        {
          type: 'add',
          data: {
            ...data,
            subdirectoryPath
          },
          path: `${outputPath}/{{camelCase subdirectoryPath}}/${date}-{{scriptType}}-{{dashCase name}}.js`,
          templateFile: `${templatePath}/${fileName}`,
          skipIfExists: true
        }
      ];
    }
  });
};

module.exports = migrationGenerator;
