const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
// const jsonPath = require("./path.json");
// const binaries = require("ffmpeg-binaries");

const downloadYoutubeVideo = async (url, bot, chatId, fileName) => {
  try {
    const mp3 = `./mp3/track_${Date.now()}.mp3`;
    // const res = fs.createWriteStream(mp3);

    // console.log("PATH TO DIR", typeof url);
    if (url) {
      let procc = new ffmpeg({
        source: url,
      });
      procc.setFfmpegPath(ffmpegPath);
      procc
        .withAudioBitrate("320k")
        .output(`./mp3/${fileName}`)
        .format("mp3")
        .audioCodec("libmp3lame")
        .on("start", (cmd) => {
          console.log("--- ffmpeg start process ---");
          console.log(`cmd: ${cmd}`);
        })
        .on("end", (cmd) => {
          bot.sendAction(chatId, "upload_audio");
          console.log("--- end processing ---");
          // console.log(procc);
          bot.sendAudio(chatId, procc._outputs[0].target);
        })
        .on("error", (err) => {
          console.log("--- ffmpeg meets error ---");
          console.log(err);
        })
        .run();
      // console.log(res);
    }
  } catch (e) {
    console.log(e.msg);
  }
};
module.exports = downloadYoutubeVideo;
