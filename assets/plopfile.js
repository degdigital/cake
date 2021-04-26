module.exports = plop => {
  const templatePath = `.plop`;
  const componentTemplatePath = `${templatePath}/Component`;
  const graphQlTemplatePath = `${templatePath}/GraphQL`;
  const componentPath = `components/{{pascalCase name}}`;
  const graphQlPath = `graphql/{{camelCase subdirectory}}`;
  const includeCssModules = 'includeCssModules';
  const storybookMdxValue = 'storybookmdx';
  const storybookCsfValue = 'storybookcsf';

  plop.setGenerator('component', {
    description: 'Create a new React component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        validate: input =>
          input.length !== 0 ? true : 'Please enter a component name.',
        message: 'What is your component name?'
      },
      {
        type: 'confirm',
        name: includeCssModules,
        default: true,
        message: 'Do you want to create a CSS Modules file?'
      },
      {
        type: 'list',
        name: 'storybooktype',
        choices: [
          {
            name: 'MDX (Markdown with JSX)',
            value: storybookMdxValue
          },
          {
            name: 'CSF (Component Story Format)',
            value: storybookCsfValue
          },
          {
            name: 'None',
            value: 'none'
          }
        ],
        default: storybookMdxValue,
        message: 'Which Storybook story format would you like?'
      }
    ],
    actions: data => {
      let actions = [];
      actions.push(
        {
          type: 'add',
          path: `${componentPath}/index.js`,
          templateFile: `${componentTemplatePath}/Component.js.hbs`,
          data: {
            includeCssModules: data.includeCssModules
          }
        },
        {
          type: 'add',
          path: 'components/index.js',
          templateFile: `${componentTemplatePath}/injectable-index.js.hbs`,
          skipIfExists: true
        },
        {
          type: 'append',
          path: 'components/index.js',
          pattern: `/* PLOP_INJECT_DO_NOT_REMOVE */`,
          template: `export \{ default as {{pascalCase name}} \} from '@components/{{pascalCase name}}';`
        }
      );
      if (data.includeCssModules) {
        actions.push({
          type: 'add',
          path: `${componentPath}/{{pascalCase name}}.module.css`,
          templateFile: `${componentTemplatePath}/Component.css.js.hbs`
        });
      }
      if (data.storybooktype === storybookMdxValue) {
        actions.push({
          type: 'add',
          path: `${componentPath}/{{pascalCase name}}.stories.mdx`,
          templateFile: `${componentTemplatePath}/Component.mdx.js.hbs`
        });
        actions.push({
          type: 'add',
          path: `${componentPath}/sampleData.js`,
          templateFile: `${componentTemplatePath}/SampleData.js.hbs`
        });
      }
      if (data.storybooktype === storybookCsfValue) {
        actions.push({
          type: 'add',
          path: `${componentPath}/{{pascalCase name}}.stories.js`,
          templateFile: `${componentTemplatePath}/Component.csf.js.hbs`
        });
        actions.push({
          type: 'add',
          path: `${componentPath}/sampleData.js`,
          templateFile: `${componentTemplatePath}/SampleData.js.hbs`
        });
      }
      return actions;
    }
  });

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
      }
    ],
    actions: data => {
      let actions = [];
      actions.push(
        {
          type: 'add',
          path: `${graphQlPath}/{{camelCase name}}.js`,
          templateFile: `${graphQlTemplatePath}/Query.js.hbs`,
          skipIfExists: true
        },
        {
          type: 'add',
          path: 'graphql/index.js',
          templateFile: `${graphQlTemplatePath}/injectable-index.js.hbs`,
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
