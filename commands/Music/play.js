const prettyMilliseconds = require('pretty-ms');
const { MessageEmbed } = require("discord.js");
const ordinal = require('ordinal');

const sendMessage = require('../../utils/patchInteract');
const initalInteract = require('../../utils/initalInteract');

module.exports = {
  config: {
    name: "play",
    description: "Plays a song or adds to the current queue.",
    usage: "<guild-set-prefix> play <song query/youtube url>",
    category: "Music",
    accessableby: "Members",
    aliases: ["p"],
    options: [{
      name: "query",
      description: "URL or a search query of the song.",
      type: 3,
      required: true
    }]
  },

  run: async (client, message, args) => {

    //makes an inital POST request so it says the bot is thinking
    args.isInteraction ? initalInteract(client, message) : null;

    try {
      var channel = client.guilds.cache.get(message.guild_id).member(message.member.user.id).voice.channel;
    } catch (TypeError) {
      return sendMessage(args, client, message, "**❌: Join a voice channel first.**", "❌");
    }
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

    //function that builds the song details embed.
    const embedBuilder = (track) => {
      return new MessageEmbed()
        .setDescription(player.queue.totalSize ? "**``" + `${player.queue.size ? `${ordinal(player.queue.size + 1)} in Queue - (in ${prettyMilliseconds(player.queue.duration - player.position, { colonNotation: true, secondsDecimalDigits: 0 })}` : `Playing Next - (in ${prettyMilliseconds(player.queue.duration - player.position, { colonNotation: true, secondsDecimalDigits: 0 })}`})` + "``**" : "**``Playing Now``**")
        .setURL(track.uri)
        .setThumbnail(track.thumbnail)
        .setColor("#B44874")
        .setTitle("**" + track.title + "**")
        .addField("Uploader:", `${track.author}`, true)
        .addField("Duration:", `${prettyMilliseconds(track.duration, { colonNotation: true, secondsDecimalDigits: 0 })}`, true)
        .setTimestamp()
        .setFooter(requestedUser.tag, requestedUser.displayAvatarURL());
    }

    //searches on youtube and what not.
    //TODO: VIDEO LENGTH
    client.manager.search(query, requestedUser).then(async res => {
      switch (res.loadType) {

        case "TRACK_LOADED":

          sendMessage(args, client, message, embedBuilder(res.tracks[0]), "👍");
          player.queue.add(res.tracks[0]);
          break;

        case "SEARCH_RESULT":

          sendMessage(args, client, message, embedBuilder(res.tracks[0]), "👍");
          player.queue.add(res.tracks[0]);
          break;

        case "PLAYLIST_LOADED":

          sendMessage(args, client, message, "**Sorry, I currently don't do playlists.**", "❌")
          break;

        case "LOAD_FAILED":

          sendMessage(args, client, message, "**Huh, something bad happened. **", "❌")
          break;

        case "NO_MATCHES":

          sendMessage(args, client, message, "**Could not find that song, maybe try again?**", "❌")
          break;

        default:

          sendMessage(args, client, message, "**Well, something went really wrong. Maybe try again later?**", "❌")
          break;
      }

      if (!player.playing) player.play();
    });

  }
}

