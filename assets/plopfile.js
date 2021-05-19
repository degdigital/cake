const componentGenerator = require('./.plop/Component.generator.js');
const graphqlGenerator = require('./.plop/GraphQL.generator.js');
const migrationGenerator = require('./.plop/Migration.generator.js');

module.exports = plop => {
  const settings = {
    basePath: `.plop`
  };

  componentGenerator(plop, settings);
  graphqlGenerator(plop, settings);
  migrationGenerator(plop, settings);
  iconGenerator(plop, settings);
};
