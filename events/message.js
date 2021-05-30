module.exports = {
  name: 'message',
  execute(message, client) {
    if (message.author.bot || message.channel.type === "dm") return;

    let args = message.content.slice(client.guildPrefixes[message.guild.id].length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    let commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
    if (commandfile) { //for force chat command
      commandfile.run(client, message, args)
    }
  },
};