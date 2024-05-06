const { EmbedBuilder } = require("discord.js");
const provider = require("../utils/provider");

module.exports.addSongEmbed = function (track, queueSize) {
  const [providerName, providerIcon] = provider.getProviderDetails(
    track.queryType
  );

  return new EmbedBuilder()
    .setColor("#B44874")
    .setTitle(`**${track.title}** - ${track.author}`)
    .setURL(track.url)
    .setDescription(`Requested by: ${track.requestedBy}`)
    .setThumbnail(track.thumbnail)
    .addFields(
      { name: "Duration", value: track.duration },
      {
        name: "Position (Queue)",
        value: queueSize ? String(queueSize) : "Playing now!",
      }
    )
    .setFooter({
      text: `Playing from ${providerName}`,
      iconURL: providerIcon,
    })
    .setTimestamp();
};
