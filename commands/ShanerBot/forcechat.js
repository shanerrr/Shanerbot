module.exports = { 
  config: {
      name: "forcechat",
      description: "The text channel that the command is ran on will force the bot to only talk in that channel.",
      usage: "ur forcechat [on/off]",
      category: "ShanerBot",
      accessableby: "Administrator",
      aliases: ["fc"]
  },
  run: async (client, message, args) => {
    if (message.member.hasPermission('ADMINISTRATOR')) {
      if (!args[0]) return message.channel.send("`Please state either [on/off] to turn on force chat to this text channel or to turn off force chat respectively.`").then(msg => msg.delete({timeout: 5000}));
      if (args[0].toUpperCase() == "ON") {
        if (!message.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) {
            message.react("❌");
            return message.channel.send("`dude, i dont have the permission to delete messages needed to enforce using commands to one text channel.`").then(msg => msg.delete({timeout: 5000}));
        }
        client.database.put(message.guild.id+"F", message.channel.id);
        return message.react("✅");
      } else if (args[0].toUpperCase() == "OFF") {
          client.database.del(message.guild.id+"F");
          return message.react("✅");
      } else {
        return message.react("❓");
      }
    }
    else return;
  }
}

