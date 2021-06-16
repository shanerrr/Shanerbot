module.exports = {
  name: 'message',
  execute(message, client) {
    if (message.author.bot || message.channel.type === "dm") return;

    let args = message.content.slice(client.guildPrefixes[message.guild.id].length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if (!message.content.toLowerCase().startsWith(client.guildPrefixes[message.guild.id])) return;

    let commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (commandfile) { //for force chat command
      commandfile.run(client, message, { content: args, isInteraction: false });
    }
  },
};