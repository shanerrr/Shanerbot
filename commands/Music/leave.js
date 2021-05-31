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

    //checks if player exists.
    if (!player) return sendMessage(`😲 **are you dumb? I can't leave a channel I'm not in?**`, false);

    //checks if member has a permission
    else if (client.guilds.cache.get(message.guild?.id || message.guild_id).member(message.member?.id || message.member.user.id).hasPermission("MOVE_MEMBERS") || !player.queue.totalSize) {
      player.destroy();
      return sendMessage(`😔 **Alright, I'll show myself out...**`, true);
    }

    //checks if user is by himself in channel
    else if (channel.members.size <= 2) {
      player.destroy();
      return sendMessage(`😔 **Alright, I'll leave you to yourself...**`, true);
    }

    //if user is a normie and have no perms or what not.
    else return sendMessage(`**Haha, who even are you? Maybe you should leave...**`, false);
  }
}