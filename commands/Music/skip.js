const sendMessage = require('../../utils/patchInteract');
const initalInteract = require('../../utils/initalInteract');

module.exports = {
  config: {
    name: "skip",
    description: "Skips the current playing song.",
    usage: "<guild-set-prefix> skip",
    category: "Music",
    accessableby: "Members",
    aliases: ["s"],
    options: []
  },
  run: async (client, message, args) => {

    //makes an inital POST request so it says the bot is thinking
    args.isInteraction ? initalInteract(client, message) : null;

    //gets player and member
    const player = client.manager.players.get(message.guild?.id || message.guild_id);
    const member = client.guilds.cache.get(message.guild?.id || message.guild_id).member(message.member?.id || message.member.user.id);

    //if no player or any song playing.
    if (!player || !player.queue.current) return sendMessage(args, client, message, "**❌: Bro, what am I supposed to skip here?**", "❌");

    //deconstructs title, requester and url from the current playing song.
    const { requester } = player.queue.current;

    //if more than 2 people, does not have perm move mebers and if the song requester is not the guy skipping it. 
    if (client.channels.cache.get(player.voiceChannel).members.size > 2 && !member.hasPermission("MOVE_MEMBERS") && requester.id != member.id) {
      return sendMessage(args, client, message, "**❌: Sorry, I am not skipping anything for you.**", "❌");
    }

    //sends the message of the skipped song
    sendMessage(args, client, message, "**⏭️ Skipped!**", "⏭️");
    return player.stop();
  }
}