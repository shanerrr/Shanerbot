const { prefix } = require("../../botconfig.json");

module.exports = async (client, message) => { 
    if(message.author.bot || message.channel.type === "dm") return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if(!message.content.startsWith(prefix)) return;
    if(client.cooldown.has(message.author.id)) return;
    if(!(message.author.id == 234743458961555459 || message.author.id == 168603442175148032 || message.author.id == 274682875113111553)){
        client.cooldown.add(message.author.id)
    }
    if (client.database.has(message.guild.id+"F") && client.database.get(message.guild.id+"F") != message.channel.id && !message.content.includes("forcechannel")) {
        client.channels.fetch(client.database.get(message.guild.id+"F")).then(channela => message.channel.send("`Please use the`**`"+channela.name+"`**`text channel for all ShanerBot commands.`").then(msg => msg.delete({timeout: 5000})));
        return message.delete();
        // return message.channel.send("`Please use the"+`${client.channels.fetch(client.database.get(message.guild.id+"F"))}`+"`").then(msg => msg.delete(5000));
    }
    let commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
    if(commandfile) commandfile.run(client, message, args)

    setTimeout(() => {
        client.cooldown.delete(message.author.id)
    }, 5000)
}