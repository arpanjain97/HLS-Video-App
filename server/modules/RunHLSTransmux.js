const mkdirp = require('mkdirp');
const fs = require('fs');
const FFMPEG = require('fluent-ffmpeg');

function runHLSTransmux(input, outputFolder) {
  const outputPath = `./public/${outputFolder}`;
  mkdirp.sync(outputPath);

  const ffmpegSD = new FFMPEG()
    .addInput(input)
    .addOption('-profile:v baseline')
    .addOption('-level 3.0')
    .addOption('-s 640x360')
    .addOption('-start_number 0')
    .addOption('-hls_time 10')
    .addOption('-hls_list_size 0')
    .addOption('-f hls')
    .output(`${outputPath}/sd_out.m3u8`);
  const ffmpegSDP = generateFFMPEGP(ffmpegSD);

  const ffmpegHD = new FFMPEG()
    .addInput(input)
    .addOption('-profile:v baseline')
    .addOption('-level 3.0')
    .addOption('-s 1280x720')
    .addOption('-start_number 0')
    .addOption('-hls_time 10')
    .addOption('-hls_list_size 0')
    .addOption('-f hls')
    .output(`${outputPath}/hd_out.m3u8`);
  const ffmpegHDP = generateFFMPEGP(ffmpegHD);

  const copyP = new Promise((res, rej) => {
    fs.copyFile('./index.m3u8', `${outputPath}/index.m3u8`, (err) => {
      if(err) {
        rej(err);
        return;
      }
      res();
    });
  });
  return Promise.all([ffmpegSDP, ffmpegHDP, copyP]);
}

function generateFFMPEGP (ffmpeg){
  let resolve, reject, hasError = false;
  const blockingPromise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });


  ffmpeg.on('start', (command) =>
    console.debug('[INFO] FFMPEG transcoding started with command: ' + command)
  );

  ffmpeg.on('stderr', (stdErrline) =>
    console.error(stdErrline)
  );

  ffmpeg.on('error', (err, stdout, stderr) => {
    hasError = true;
    console.error(err.message);
    reject(err);
  });

  ffmpeg.on('end', (stdout, stderr) => {
    if (!hasError) resolve();
    console.debug('[INFO] Transcoding ended');
  });

  ffmpeg.run();

  return blockingPromise;
}

module.exports = runHLSTransmux;
