const {
  componentGenerator,
  graphqlGenerator,
  migrationGenerator,
  iconGenerator
} = require('./.plop/index.js');

module.exports = plop => {
  const settings = {
    basePath: `.plop`
  };

  componentGenerator(plop, settings);
  graphqlGenerator(plop, settings);
  migrationGenerator(plop, settings);
  iconGenerator(plop, settings);
};
