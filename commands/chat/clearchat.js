module.exports = { 
  config: {
      name: "clearchat",
      description: "clear recent messages sent by me.",
      usage: "ur clearchat <# of messages (MAX:50)>",
      category: "chat",
      accessableby: "Moderators",
      aliases: ["clearc"]
  },
  run: async (client, message, args) => {

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("`srry, nop, you dont have the permission to delete messages.`").then(msg => msg.delete({timeout: 5000}));
    if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) return message.channel.send("`dude, i dont have the permission to delete messages.`").then(msg => msg.delete({timeout: 5000}));
    if (!args[0]) return message.channel.send("`dude, how many messages to delete?`").then(msg => msg.delete({timeout: 5000}));
    if(args[0]>50) return message.channel.send("i can only delete 50 messages at a time.").then(msg => msg.delete({timeout: 5000}));
    message.channel.bulkDelete(args[0], false);
 } 
}

