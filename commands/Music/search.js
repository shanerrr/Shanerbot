const prettyMilliseconds = require('pretty-ms');
const { MessageEmbed } = require("discord.js");
const ordinal = require('ordinal');
const sendMessage = require('../../utils/sendInteractEmbed');
const sendStandardMsg = require('../../utils/sendInteractMsg');

module.exports = {
  config: {
    name: "search",
    description: "Searches for a song and adds to queue.",
    usage: "<guild-set-prefix> search <song query/youtube url>",
    category: "Music",
    accessableby: "Members",
    aliases: [],
    options: [{
      name: "query",
      description: "Search for a song or direct url.",
      type: 3,
      required: true
    }]
  },

  run: async (client, message, args) => {

    const channel = message.member.voice?.channel || client.guilds.cache.get(message.guild_id).member(message.member.user.id).voice.channel;
    const query = args.isInteraction ? args['0'].value : args?.content.join(' ') || "";
    const requestedUser = client.guilds.cache.get(message.guild?.id || message.guild_id).member(message.member?.id || message.member.user.id).user

    //if player doesn't exist, make on ore return an already created one.
    const player = client.manager.create({
      guild: message.guild?.id || message.guild_id,
      voiceChannel: channel?.id,
      textChannel: message.channel?.id || message.channel_id,
      selfDeafen: true
    });
    if (player.state === "DISCONNECTED") player.connect();

    //searches on youtube and what not.
    //TODO: VIDEO LENGTH
    client.manager.search(query, requestedUser).then(async res => {
      switch (res.loadType) {

        case "TRACK_LOADED":

          // if (res.tracks[0].duration > 10800000) return message.channel.send("`im not in the mood to listen to anything longer than 3 hours sorry nty.`");
          const songEmbed = new MessageEmbed()
            .setDescription(player.queue.totalSize ? "**``" + `${player.queue.size ? `${ordinal(player.queue.size + 1)} in Queue` : "Playing Next"}` + "``**" : "**``Playing Now``**")
            .setURL(res.tracks[0].uri)
            .setThumbnail(res.tracks[0].thumbnail)
            .setColor("#B44874")
            .setTitle("**" + res.tracks[0].title + "**")
            .addField("Uploader:", `${res.tracks[0].author}`, true)
            .addField("Duration:", `${prettyMilliseconds(res.tracks[0].duration, { colonNotation: true, secondsDecimalDigits: 0 })}`, true)
            .setTimestamp()
            .setFooter(requestedUser.tag, requestedUser.displayAvatarURL());

          player.queue.add(res.tracks[0]);
          sendMessage(args, client, message, songEmbed, "👍");
          break;

        case "SEARCH_RESULT":

          // if (res.tracks[0].duration > 10800000) return message.channel.send("`im not in the mood to listen to anything longer than 3 hours sorry nty.`");
          // const songSearchEmbed = new MessageEmbed()
          //   .setDescription(player.queue.totalSize ? "**``" + `${player.queue.size ? `${ordinal(player.queue.size + 1)} in Queue` : "Playing Next"}` + "``**" : "**``Playing Now``**")
          //   .setURL(res.tracks[0].uri)
          //   .setThumbnail(res.tracks[0].thumbnail)
          //   .setColor("#B44874")
          //   .setTitle("**" + res.tracks[0].title + "**")
          //   .addField("Uploader:", `${res.tracks[0].author}`, true)
          //   .addField("Duration:", `${prettyMilliseconds(res.tracks[0].duration, { colonNotation: true, secondsDecimalDigits: 0 })}`, true)
          //   .setTimestamp()
          //   .setFooter(requestedUser.tag, requestedUser.displayAvatarURL());

          // player.queue.add(res.tracks[0]);
          const queryEmbed = new MessageEmbed()
            .setTitle("**Search Results**")
            .setColor("#B44874")
            .setTimestamp()
            .setDescription(res.tracks.slice(0, 15).map((video, idx) => `**[${idx + 1}] -** ${video.title} ~ **__[${prettyMilliseconds(video.duration, { colonNotation: true, secondsDecimalDigits: 0 })}]__**`))
            .setFooter(requestedUser.tag, requestedUser.displayAvatarURL());
          // .setFooter("You have 30 seconds to pick a song. Type 'cancel' to cancel the selection", client.user.displayAvatarURL());
          sendMessage(args, client, message, queryEmbed, "👍");
          break;

        case "PLAYLIST_LOADED":

          sendStandardMsg(args, client, message, "**Sorry, I currently don't do playlists.**", "❌")
          break;

        case "LOAD_FAILED":

          sendStandardMsg(args, client, message, "**Huh, something bad happened. **", "❌")
          break;

        case "NO_MATCHES":

          sendStandardMsg(args, client, message, "**Could not find that song, maybe try again?**", "❌")
          break;

        default:

          sendStandardMsg(args, client, message, "**Well, something went really wrong. Maybe try again later?**", "❌")
          break;
      }

      // if (!player.playing) player.play();
    });

  }
}

