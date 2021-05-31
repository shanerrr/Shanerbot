// const { MessageEmbed } = require("discord.js");
const Guild = require('../../models/Guild');

module.exports = {
  config: {
    name: "play",
    description: "Plays a song or adds to the queue.",
    usage: "<guild-set-prefix> play <song query/youtube url>",
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

    //to deal with slash commands and what not.
    const sendMessage = (msg, isOk) => {
      if (args.isInteraction) {
        return client.api.interactions(message.id, message.token).callback.post({
          data: {
            type: 4,
            data: {
              content: msg
            }
          }
        });
      }
      else {
        isOk ? message.react("👍") : message.react("❌");
        return message.channel.send(msg).then(msg => msg.delete({ timeout: 5000 }));
      }
    }

    //if player doesn't exist, make on ore return an already created one.
    const player = client.manager.create({
      guild: message.guild?.id || message.guild_id,
      voiceChannel: channel?.id,
      textChannel: message.channel?.id || message.channel_id,
    });
    player.connect();

    //searches on youtube and what not.
    //TODO: VIDEO LENGTH
    client.manager.search(query, client.guilds.cache.get(message.guild?.id || message.guild_id).member(message.member?.id || message.member.user.id).user).then(async res => {
    
      switch (res.loadType) {

        case "TRACK_LOADED":
          player.queue.add(res.tracks[0]);
          player.play()
          break;
        case "SEARCH_RESULT":
          player.queue.add(res.tracks[0]);
          player.play()
          break;
        case "PLAYLIST_LOADED":

          break;
        case "LOAD_FAILED":

          break;
        case "NO_MATCHES":

          break;

        default:
          break;
      }
    })
    // const res = await client.manager.search(
    //   message.content.slice(6),
    //   message.author
    // );
    // if (!player) {
    //   let commandfile = client.commands.get("join");
    //   if (commandfile) commandfile.run(client, message, []);
    //   player = client.manager.players.get(message.guild.id);
    // }
    //TODO: RUN JOIN COMMAND



  }
}

