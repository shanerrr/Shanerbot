const sendMessage = require('../../utils/patchInteract');
const initalInteract = require('../../utils/initalInteract');

module.exports = {
  config: {
    name: "join",
    description: "Summons the bot to your voice channel you're currently in.",
    usage: "<guild-set-prefix> join",
    category: "Music",
    accessableby: "Members",
    aliases: [],
    options: []
  },
  run: async (client, message, args) => {

    //makes an inital POST request so it says the bot is thinking
    args.isInteraction ? initalInteract(client, message) : null;

    const player = client.manager.players.get(message.guild?.id || message.guild_id);
    try {
      var channel = client.guilds.cache.get(message.guild_id).member(message.member.user.id).voice.channel;
    } catch (TypeError) {
      return sendMessage(args, client, message, "**❌: Join a voice channel first.**", "❌");
    }

    //if the player is not in a channel already, it'll create a player instance for that channel
    if (!player) {
      let permissions = channel.permissionsFor(client.user);
      if (!permissions.has("CONNECT")) return sendMessage(args, client, message, "**😢 mannnn, i don't have the permission to join that channel.**", "❌");
      if (!permissions.has("SPEAK")) return sendMessage(args, client, message, "**🤐 dude, i can't talk in there man.**", "❌");
      if (channel.full) return sendMessage(args, client, message, "**😭 there is not enough room for me man, ttyl.**", "❌");

      client.manager.create({
        guild: message.guild?.id || message.guild_id,
        voiceChannel: channel?.id,
        textChannel: message.channel?.id || message.channel_id,
        selfDeafen: true
      }).connect();

      return sendMessage(args, client, message, `**👍 Joined: <#${channel.id}>**`, "👍");
    }
    //If the bot is already connected to a channel error
    else {
      if (player && (player.voiceChannel != channel.id)) return sendMessage(args, client, message, `😒 **nty, I'm already in <#${player.voiceChannel}> and I'm having fun.**`, "❌");
    }
  }
}