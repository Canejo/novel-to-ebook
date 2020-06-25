(function () {
    let spawn; let path; let temp; let
      fs;
    spawn = require('child_process').spawn;
    path = require('path');
    temp = require('temp');
    fs = require('fs');
    module.exports = function (epub, callback) {
      temp.track();
      return temp.mkdir('node-kindlegen', (error, tempDir) => {
        let inputPath; let
          outputPath;
        if (error) {
          return callback(error);
        }
        inputPath = path.join(tempDir, 'input.epub');
        outputPath = path.join(tempDir, 'output.mobi');
        return fs.writeFile(inputPath, epub, (error, written, string) => {
          let kindlegen;
          if (error) {
            return callback(error);
          }
          kindlegen = spawn(path.resolve(__dirname, '..', '..', 'bin/kindlegen'), ['input.epub', '-c2', '-verbose', '-o', 'output.mobi'], {
            cwd: tempDir,
            env: {},
          });
          return kindlegen.on('close', (code) => {
            if (code !== 0 && code !== 1) {
              return callback(new Error(`kindlegen returned error ${code}`));
            }
            return fs.readFile(outputPath, (error, mobi) => {
              if (error) {
                return callback(error);
              }
              return callback(null, mobi);
            });
          });
        });
      });
    };
  }).call(this);
  