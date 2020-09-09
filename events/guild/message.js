const { prefix } = require("../../botconfig.json");

module.exports = async (client, message) => { 
    if(message.author.bot || message.channel.type === "dm") return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if(!message.content.toLowerCase().startsWith(prefix)) return;
    if(client.cooldown.has(message.author.id)) return;
    if(client.reportcooldown.has(message.author.id)) {
        message.reply("Report command on cooldown, please try again later.").then(msg => msg.delete({timeout: 5000}));
        if (message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) {
            return message.delete();
        }
    } 
    if(!(message.author.id == 234743458961555459 || message.author.id == 168603442175148032 || message.author.id == 274682875113111553)){
        client.cooldown.add(message.author.id)
        coolDown(client.cooldown, 5000)
    }
    if(message.content.includes(`${prefix}report`)){
        client.reportcooldown.add(message.author.id);
        coolDown(client.reportcooldown, 600000);
    }
    if (client.database.has(message.guild.id+"F") && client.database.get(message.guild.id+"F") != message.channel.id && !message.member.hasPermission('ADMINISTRATOR')) {
        if (client.forcecooldown.has(message.author.id)) {
            client.cooldown.delete(message.author.id);
            return message.delete();
        }
        message.delete();
        client.cooldown.delete(message.author.id);
        client.forcecooldown.add(message.author.id);
        coolDown(client.forcecooldown, 120000);
        return client.channels.fetch(client.database.get(message.guild.id+"F")).then(channela => message.reply("`Please use the`__**`"+channela.name+"`**__`text channel for all ShanerBot commands.`").then(msg => msg.delete({timeout: 10000})));
    }
    let commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
    if(commandfile) commandfile.run(client, message, args)

    function coolDown(context, time) {
        setTimeout(() => {
            context.delete(message.author.id)
        }, time)
    }
}