const prettyMilliseconds = require('pretty-ms');
const { MessageEmbed } = require("discord.js");
const ordinal = require('ordinal');

const initalInteract = require('../../utils/initalInteract');
const sendMessage = require('../../utils/patchInteract')

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
      description: "Song name or artist name to search for. ",
      type: 3,
      required: true
    }]
  },

  run: async (client, message, args) => {

    //makes an inital POST request so it says the bot is thinking
    args.isInteraction ? initalInteract(client, message) : null;

    const channel = message.member.voice?.channel || client.guilds.cache.get(message.guild_id).member(message.member.user.id).voice.channel;
    const msgchannel = message.channel || client.guilds.cache.get(message.guild_id).channels.cache.get(message.channel_id);

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
          // if (res.tracks[0].duration > 10800000) return message.channel.send("`im not in the mood to listen to anything longer than 3 hours sorry nty.`");
          sendMessage(args, client, message, embedBuilder(res.tracks[0]), "👍");
          player.queue.add(res.tracks[0]);
          if (!player.playing) player.play();
          break;

        case "SEARCH_RESULT":

          const queryEmbed = new MessageEmbed()
            .setColor("#B44874")
            .setTitle("Search Results for: " + "__**" + `${query}` + "**__")
            .setDescription(res.tracks.slice(0, 15).map((video, idx) => `**[${idx + 1}] -** ${video.title} - **[${prettyMilliseconds(video.duration, { colonNotation: true, secondsDecimalDigits: 0 })}]**`))
            .addField('\u200b', "**You have 30 seconds to type a number. You can type cancel to exit.**", false)
            .setTimestamp()
            .setFooter(requestedUser.tag, requestedUser.displayAvatarURL());

          sendMessage(args, client, message, queryEmbed, "👍").then((searchEmbed) => {

            //collecter for response of what song to play
            const collector = msgchannel.createMessageCollector(m => {
              return m.author.id === (message.author?.id || requestedUser.id) && (new RegExp(`^([1-9]|1[0-5]|cancel)$`, "i").test(m.content))
            }, { time: 30000, max: 1 });

            //collect events = > collect event
            collector.on('collect', m => { if (/cancel/i.test(m.content)) return collector.stop("cancelled"); });

            //event always fired at the end, no matter the reason.
            collector.on('end', (m, reason) => {
              m.filter((userMsg) => {
                if (reason === "limit") {
                  // console.log(userMsg);
                  sendMessage(args, client, args.isInteraction ? message : userMsg, embedBuilder(res.tracks[userMsg.content - 1]), "👍", searchEmbed);
                  player.queue.add(res.tracks[userMsg.content - 1]);
                  if (!player.playing) player.play();
                }
                if (reason === "cancelled") return sendMessage(args, client, args.isInteraction ? message : userMsg, "❌: **Cancelled**", "❌", searchEmbed);
              })
              if (reason === "time") return sendMessage(args, client, message, "❌: **Time ran out.**", "❌", searchEmbed);
            });
          });
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

    });

  }
}

