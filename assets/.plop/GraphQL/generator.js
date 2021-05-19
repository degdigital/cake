const graphqlGenerator = (plop, { basePath }) => {
  const templatePath = `${basePath}/GraphQL`;
  const outputPath = `graphql/{{camelCase subdirectory}}`;

  plop.setGenerator('graphql', {
    description: 'Create a new GraphQL query',
    prompts: [
      {
        type: 'input',
        name: 'name',
        validate: input =>
          input.length !== 0 ? true : 'Please enter a method name.',
        message: `What name would you like to give your querying method? (i.e., "getSiteframe")`
      },
      {
        type: 'input',
        name: 'subdirectory',
        validate: input =>
          input.length !== 0 ? true : 'Please enter a directory name.',
        message: `In which subdirectory of the "graphql" directory should your query live? (i.e., "siteframe")`
      },
      {
        type: 'list',
        name: 'contentfulSpace',
        choices: [
          {
            name: 'Loyalty',
            value: 'Loyalty'
          },
          {
            name: 'Dotcom',
            value: 'Dotcom'
          }
        ],
        default: 'loyalty',
        message: 'Which Contentful space are you querying?'
      }
    ],
    actions: data => {
      let actions = [];
      actions.push(
        {
          type: 'add',
          path: `${outputPath}/{{camelCase name}}.js`,
          templateFile: `${templatePath}/{{contentfulSpace}}Query.js.hbs`,
          skipIfExists: true
        },
        {
          type: 'add',
          path: 'graphql/index.js',
          templateFile: `${templatePath}/injectable-index.js.hbs`,
          skipIfExists: true
        },
        {
          type: 'append',
          path: 'graphql/index.js',
          pattern: `/* PLOP_INJECT_DO_NOT_REMOVE */`,
          template: `export \{ default as {{camelCase name}} \} from '@graphql/{{camelCase subdirectory}}/{{camelCase name}}';`
        }
      );
      return actions;
    }
  });
};

module.exports = graphqlGenerator;
