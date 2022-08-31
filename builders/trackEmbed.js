const { embedAccent } = require("../config.json");
const { EmbedBuilder } = require("discord.js");
const ordinal = require("ordinal");
const ms = require("ms");

module.exports.trackEmbedBuilder = function (track, queue) {
  return new EmbedBuilder()
    .setTitle("**" + track.title + "**")
    .setDescription(
      queue?.current
        ? "**``" +
            `${
              queue?.current && !queue.tracks.length
                ? `Playing Next - (in ${ms(
                    queue.current.durationMS - queue.streamTime
                  )}`
                : `${ordinal(queue.tracks.length + 1)} In Queue - (in ${ms(
                    queue.current.durationMS +
                      queue.totalTime -
                      queue.streamTime
                  )}`
            })` +
            "``**"
        : "**``Playing Now``**"
    )
    .setURL(track.url)
    .setThumbnail(track.thumbnail)
    .setColor(Number(embedAccent))
    .addFields(
      { name: "Uploader:", value: track.author, inline: true },
      { name: "Duration:", value: track.duration, inline: true }
    )
    .setTimestamp();
};
