const { embedAccent } = require("../config.json");
const { MessageEmbed } = require("discord.js");
const ordinal = require("ordinal");
const prettyMilliseconds = require("pretty-ms");

module.exports.trackEmbedBuilder = function (track, queue) {
  return new MessageEmbed()
    .setTitle("**" + track.title + "**")
    .setDescription(
      queue?.current
        ? "**``" +
            `${
              queue?.current && !queue.tracks.length
                ? `Playing Next - (in ${prettyMilliseconds(
                    queue.current.durationMS - queue.streamTime,
                    { colonNotation: true, secondsDecimalDigits: 0 }
                  )}`
                : `${ordinal(
                    queue.tracks.length + 1
                  )} In Queue - (in ${prettyMilliseconds(
                    queue.current.durationMS +
                      queue.totalTime -
                      queue.streamTime,
                    { colonNotation: true, secondsDecimalDigits: 0 }
                  )}`
            })` +
            "``**"
        : "**``Playing Now``**"
    )
    .setURL(track.url)
    .setThumbnail(track.thumbnail)
    .setColor(embedAccent)
    .addField("Uploader:", `${track.author}`, true)
    .addField("Duration:", track.duration, true)
    .setTimestamp();
};
