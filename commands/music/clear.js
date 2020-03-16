const {MessageEmbed} = require("discord.js")
const prettyMilliseconds = require('pretty-ms');

module.exports = { 
    config: {
        name: "clear",
        description: "i will clear an active queue.",
        usage: "ur clear",
        category: "music",
        accessableby: "Moderators",
        aliases: []
    },
    run: async (client, message, args) => {

        const player = client.music.players.get(message.guild.id);
        if (!player) return message.channel.send("`bruh, r u dumb? Not even gonna say anything.`");

        const sEmbed = new MessageEmbed()
        .setAuthor(`${message.author.username}: Cleared Queue`, message.author.displayAvatarURL())
        .setColor("#B44874")
        .setTitle(`**${message.guild.name}'s Queue**`)
        .setDescription(`**Cleared Queue:** __${player.queue.size}__ song(s), **(__${prettyMilliseconds(player.queue.duration, {colonNotation: true, secondsDecimalDigits: 0})}__)** total length.`)       
        .setFooter(`ShanerBot: QueueClear (${message.guild.name})`, client.user.displayAvatarURL())
            message.channel.send({embed:sEmbed});
        player.stop(); 
        player.queue.clear();

    }
}