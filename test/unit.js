import Mocha from 'mocha';
import glob from 'glob';

const mocha = new Mocha();

glob('src/**/*.spec.js', {}, (err, files) => {
  files.forEach((file) => mocha.addFile(file));

  mocha.run((failures) => {
    process.on('exit', () => {
      process.exit(failures);
    });
  });
});
