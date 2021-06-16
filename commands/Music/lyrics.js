const { MessageEmbed } = require("discord.js");
const { getLyrics, otherDetails } = require('../../utils/lyricsAPI');

const sendMessage = require('../../utils/patchInteract');
const initalInteract = require('../../utils/initalInteract');

module.exports = {
  config: {
    name: "lyrics",
    description: "Fetches the lyrics for the current playing song.",
    usage: "<guild-set-prefix> lyrics",
    category: "Music",
    accessableby: "Members",
    aliases: [],
    options: []
  },
  run: async (client, message, args) => {

    args.isInteraction ? initalInteract(client, message) : null;

    const player = client.manager.players.get(message.guild?.id || message.guild_id);

    //checks if there is a player and if there is a current playing song.
    if (!player) return sendMessage(args, client, message, "**❌: Bro, let me find the lyrics to your stupidity...**", "❌");
    if (!player.queue.totalSize) return sendMessage(args, client, message, "**❌: There is no song playing?**", "❌");

    const requestedUser = client.guilds.cache.get(message.guild?.id || message.guild_id).member(message.member?.id || message.member.user.id).user
    const embedArray = new Array();

    //gets the lyrics and breaks it into chunks if greater than embed limit of 2048 characters.
    const songDetails = await getLyrics(player.queue.current.title);
    if (!songDetails) return sendMessage(args, client, message, "**❌: Can't find the lyrics for that song, sorry.**", "❌");
    const otherSongDetails = await otherDetails(songDetails.id);

    if (songDetails.lyrics.length > 2048) var chunks = songDetails.lyrics.match(/(.|[\r\n]){1,2048}(\s|$)/g);
    else {
      const lyricsEmbed = new MessageEmbed()
        .setColor("#B44874")
        .setTitle(`**${otherSongDetails.data.response.referents[0].annotatable.link_title}**`)
        // .setURL(otherSongDetails.data.response.referents[0].annotatable.url)
        .setDescription(songDetails.lyrics)
        .setThumbnail(songDetails.albumArt)
        .setTimestamp()
        .setFooter(requestedUser.tag, requestedUser.displayAvatarURL())
      return sendMessage(args, client, message, lyricsEmbed, "👍");
    }

    //adds all the cunks of embeds to an array send one embed at a time
    chunks.forEach((_, x) => {
      embedArray.push(
        new MessageEmbed()
          .setColor("#B44874")
          .setTitle(!x ? `**${otherSongDetails.data.response.referents[0].annotatable.link_title}**` : "")
          // .setURL(otherSongDetails.data.response.referents[0].annotatable.url)
          .setDescription(chunks[x])
          .setThumbnail(!x ? songDetails.albumArt : "")
          .setFooter(x == chunks.length - 1 ? requestedUser.tag : "", x == chunks.length - 1 ? requestedUser.displayAvatarURL() : "")
      );
      !args.isInteraction && sendMessage(args, client, message, embedArray.pop(), null);
    });
    // send an array of embeds for the interact (webhooks)
    args.isInteraction && sendMessage(args, client, message, embedArray, null);
  }
}