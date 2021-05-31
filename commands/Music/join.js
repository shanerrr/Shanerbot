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

    const player = client.manager.players.get(message.guild?.id || message.guild_id);
    const channel = message.member.voice?.channel || client.guilds.cache.get(message.guild_id).member(message.member.user.id).voice.channel;

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
        return message.channel.send(msg).then(msg => msg.delete({ timeout: 10000 }));
      }
    }

    //if the player is not in a channel already, it'll create a player instance for that channel
    if (!player) {
      let permissions = channel.permissionsFor(client.user);
      if (!permissions.has("CONNECT")) return sendMessage("😢 mannnn, i don't have the permission to join that channel.", false);
      if (!permissions.has("SPEAK")) return sendMessage("🤐 dude, i can't talk in there man.", false);
      if (channel.full) return sendMessage("😭 there is not enough room for me man, ttyl.", false);

      client.manager.create({
        guild: message.guild?.id || message.guild_id,
        voiceChannel: channel?.id,
        textChannel: message.channel?.id || message.channel_id,
      }).connect();

      return sendMessage(`**👍 Joined: <#${channel.id}>**`, true);
    }
    //If the bot is already connected to a channel error
    else {
      if (player && (player.voiceChannel != channel.id)) return sendMessage(`😒 **nty, I'm already in <#${player.voiceChannel}> and I'm having fun.**`, false);
    }
  }
}