const TeleBot = require("telebot");
const downloadYoutubeVideo = require("./convert");
const youtubedl = require("youtube-dl");
const fs = require("fs");

const token = "1068931964:AAFnMaFAX6G6Rh3n_ljhv7tnE1NYG3JxZ54";

const bot = new TeleBot({ token, polling: true });

bot.on("text", async (msg) => {
  const chatId = msg.chat.id;
  const mp4 = `./mp4/video_${Date.now()}.mp4`;
  // const video = ytdl(msg.text).pipe(fs.createWriteStream(mp4));
  // console.log(video.path);
  let downloaded = 0;

  if (fs.existsSync(mp4)) {
    downloaded = fs.statSync(mp4).size;
  }

  const video = youtubedl(
    msg.text,

    // Optional arguments passed to youtube-dl.
    ["--format=18"],

    // start will be sent as a range header
    { start: downloaded, cwd: __dirname }
  );

  // Will be called when the download starts.
  video.on("info", function (info) {
    console.log("Download started");
    console.log("filename: " + info._filename);
    bot.sendAction(chatId, "upload_audio");
    // info.size will be the amount to download, add
    let total = info.size + downloaded;
    console.log("size: " + total);

    if (downloaded > 0) {
      // size will be the amount already downloaded
      console.log("resuming from: " + downloaded);

      // display the remaining bytes to download
      console.log("remaining bytes: " + info.size);
    }
  });

  video.pipe(fs.createWriteStream(mp4, { flags: "a" }));

  // Will be called if download was already completed and there is nothing more to download.
  video.on("complete", function complete(info) {
    bot.sendAction(chatId, "upload_audio");
    console.log("filename: " + info._filename + " already downloaded.");
  });

  video.on("end", function (info) {
    bot.sendAction(chatId, "upload_audio");
    youtubedl.getInfo(msg.text, function (err, info) {
      if (err) throw err;

      downloadYoutubeVideo(mp4, bot, chatId, info._filename);
    });

    console.log("finished downloading!");
  });
});
bot.start();
