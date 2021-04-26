const chalk = require('chalk');
const contentfulTasks = require('./contentfulTasks');
const nextTasks = require('./nextTasks.js');
const projectConfigTasks = require('./projectConfigTasks.js');

const install = async projectName => {
  greet();
  const answers = await contentfulTasks(projectName);
  await nextTasks(projectName);
  await projectConfigTasks(projectName, answers);
  sayGoodbye();
};

const greet = () => {
  console.log(
    chalk.magentaBright(
      `
*********************************************
                                           
    🎂 Hi, I'm Cake! 🎂         

    I'll help you get your Contentful
    project up and running in no time.   
                                           
*********************************************
`
    )
  );
};

const sayGoodbye = () => {
  console.log(`Your project is ready!`);
};

module.exports = install;
