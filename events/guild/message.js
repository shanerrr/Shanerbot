const { prefix } = require("../../botconfig.json");

module.exports = async (client, message) => { 
    if(message.author.bot || message.channel.type === "dm") return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if(!message.content.startsWith(prefix)) return;
    if(client.cooldown.has(message.author.id)) return;
    if(!message.member.hasPermission("ADMINISTRATOR")){
        client.cooldown.add(message.author.id)
    }
    let commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
    if(commandfile) commandfile.run(client, message, args)

    setTimeout(() => {
        client.cooldown.delete(message.author.id)
    }, 5000)
}