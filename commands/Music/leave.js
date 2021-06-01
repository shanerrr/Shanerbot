const sendMessage = require('../../utils/sendInteractMsg');

module.exports = {
  config: {
    name: "leave",
    description: "Clears the queue and leaves the voice channel.",
    usage: "<guild-set-prefix> leave",
    category: "Music",
    accessableby: "Members",
    aliases: [],
    options: []
  },
  run: async (client, message, args) => {

    const player = client.manager.players.get(message.guild?.id || message.guild_id);
    const channel = message.member.voice?.channel || client.guilds.cache.get(message.guild_id).member(message.member.user.id).voice.channel;

    //checks if player exists.
    if (!player) return sendMessage(args, client, message, `😲 **are you dumb? I can't leave a channel I'm not in?**`, "❌");

    //checks if member has a permission
    else if (client.guilds.cache.get(message.guild?.id || message.guild_id).member(message.member?.id || message.member.user.id).hasPermission("MOVE_MEMBERS") || !player.queue.totalSize) {
      player.destroy();
      return sendMessage(args, client, message, `😔 **Alright, I'll show myself out...**`, "👍");
    }

    //checks if user is by himself in channel
    else if (channel.members.size <= 2) {
      player.destroy();
      return sendMessage(args, client, message, `😔 **Alright, I'll leave you to yourself...**`, "👍");
    }

    //if user is a normie and have no perms or what not.
    else return sendMessage(args, client, message, `**Haha, who even are you? Maybe you should leave...**`, "❌");
  }
}