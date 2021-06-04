const sendMessage = require('../../utils/patchInteract');
const initalInteract = require('../../utils/initalInteract');

const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require('pretty-ms');

module.exports = {
  config: {
    name: "queue",
    description: "Returns the queue information.",
    usage: "<guild-set-prefix> queue",
    category: "Music",
    accessableby: "Members",
    aliases: ["q"],
    options: []
  },
  run: async (client, message, args) => {

    //makes an inital POST request so it says the bot is thinking
    args.isInteraction ? initalInteract(client, message) : null;

    //gets player and member
    const player = client.manager.players.get(message.guild?.id || message.guild_id);
    if (!player || !player.queue.current) return sendMessage(args, client, message, "**Queue is empty.**", null);
    const { title, requester, uri, duration, thumbnail } = player.queue.current;

    const queueEmbed = new MessageEmbed()
      .setTitle("**" + title + "**")
      .setDescription("**``" + `Playing Now - (${prettyMilliseconds(player.position, { colonNotation: true, secondsDecimalDigits: 0 })}/${prettyMilliseconds(duration, { colonNotation: true, secondsDecimalDigits: 0 })})` + "``**" + ` - Requested by: <@${requester["id"]}>`)
      .setURL(uri)
      .setColor("#B44874")
      .setThumbnail(thumbnail)
      .setTimestamp()
      .setFooter(requester.tag, requester.displayAvatarURL());
    player.queue.size && queueEmbed.addField("**Currently in Queue**", "```" + player.queue.map((track, idx) => `${idx ? '\n' : ''}[${idx + 1}] - ${track.title}`) + "```");

    return sendMessage(args, client, message, queueEmbed, null);
  }
}