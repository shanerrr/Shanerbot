const { MessageEmbed } = require("discord.js");
const getArtistTitle = require('get-artist-title');
const { getLyrics } = require('../../utils/lyricsAPI');

const sendMessage = require('../../utils/patchInteract');
const sendMessagePost = require('../../utils/postInteract');

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

    //gets the artist and title from a song
    const [artist, title] = getArtistTitle(player.queue.current.title, {
      defaultArtist: player.queue.current.author
    });
    if (!artist || !title) return sendMessage(args, client, message, "**❌: I can't seem to find lyrics for this song.**", "❌");

    //gets the lyrics and breaks it into chunks if greater than embed limit of 2048 characters.
    const songDetails = await getLyrics(title, artist);
    if (songDetails.length > 2048) var chunks = songDetails.match(/(.|[\r\n]){1,2048}(\s|$)/g);
    else {
      const lyricsEmbed = new MessageEmbed()
        .setColor("#B44874")
        .setTitle(`**${author} - ${song}**`)
        .setDescription(songDetails)
        .setThumbnail(player.queue.current.thumbnail)
        .setTimestamp()
        .setFooter(`ShanerBot: Lyrics (${message.guild.name})`, client.user.displayAvatarURL())
      return sendMessage(args, client, message, lyricsEmbed, "👍");
    }

    //adds all the cunks of embeds to an array send one embed at a time
    chunks.forEach((_, x) => {
      embedArray.push(
        new MessageEmbed()
          .setColor("#B44874")
          .setTitle(!x ? `**${artist} - ${title}**` : "")
          .setDescription(chunks[x])
          .setThumbnail(!x ? player.queue.current.thumbnail : "")
          .setFooter(x == chunks.length - 1 ? requestedUser.tag : "", x == chunks.length - 1 ? requestedUser.displayAvatarURL() : "")
      );
      !args.isInteraction && sendMessage(args, client, message, embedArray.pop(), null);
    });
    // send an array of embeds for the interact (webhooks)
    args.isInteraction && sendMessage(args, client, message, embedArray, null);


    // //either send afor loop of e
    // args.isInteraction ?
    //   sendMessage(args, client, message, embedArray, null)
    //   :
    //   embedArray.map((embed, idx) => {
    //     if (!idx) sendMessage(args, client, message, embed, null);
    //     else sendMessagePost(args, client, message, embed, null);
    //   });
  }
}