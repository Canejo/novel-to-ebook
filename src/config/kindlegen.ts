(function () {
    let spawn; let path; let temp; let
      fs;
    spawn = require('child_process').spawn;
    path = require('path');
    temp = require('temp');
    fs = require('fs');
    module.exports = (epub: any, callback: any) => {
      temp.track();
      return temp.mkdir('node-kindlegen', (error: any, tempDir: any) => {
        let inputPath; let
          outputPath;
        if (error) {
          return callback(error);
        }
        inputPath = path.join(tempDir, 'input.epub');
        outputPath = path.join(tempDir, 'output.mobi');
        return fs.writeFile(inputPath, epub, (error: any, written: any, string: any) => {
          let kindlegen;
          if (error) {
            return callback(error);
          }
          kindlegen = spawn(path.resolve(__dirname, '..', '..', 'bin/kindlegen'), ['input.epub', '-c2', '-verbose', '-o', 'output.mobi'], {
            cwd: tempDir,
            env: {},
          });
          return kindlegen.on('close', (code: any) => {
            if (code !== 0 && code !== 1) {
              return callback(new Error(`kindlegen returned error ${code}`));
            }
            return fs.readFile(outputPath, (error: any, mobi: any) => {
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
  