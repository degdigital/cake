const { spawn } = require('child_process');

const nextTasks = projectName =>
  new Promise((resolve, reject) => {
    const child = spawn('npx', [
      'create-next-app',
      projectName,
      '-e',
      'https://github.com/degdigital/deg-nextjs-starter'
    ]);

    child.stdout.on('data', data => console.log(`${data}`));
    child.stderr.on('data', data => console.error(`${data}`));
    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });

module.exports = nextTasks;
