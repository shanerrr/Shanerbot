const {MessageEmbed} = require("discord.js")
const fetch = require('node-fetch');

module.exports = { 
  config: {
      name: "forcechannel",
      description: "The text channel that the command is ran on will force the bot to only talk in that channel.",
      usage: "ur forcechannel",
      category: "ShanerBot",
      accessableby: "Administrator",
      aliases: []
  },
  run: async (client, message, args) => {

    if (message.member.hasPermission("ADMINSTRATOR")) {
        if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) {
            message.react("❌");
            return message.channel.send("`dude, i dont have the permission to delete messages needed to enforce using commands to one text channel.`");
        }
        client.database.put(message.guild.id+"F", message.channel.id);
        return message.react("✅");
    }
  }
}

