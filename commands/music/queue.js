const prettyMilliseconds = require('pretty-ms');
const {MessageEmbed} = require("discord.js")

module.exports = { 
    config: {
        name: "queue",
        description: "ok i show you songs u queued.",
        usage: "ur queue",
        category: "music",
        accessableby: "Members",
        aliases: ["q", "np"]
    },
    run: async (client, message, args) => {

        const player = client.manager.players.get(message.guild.id);
        if(!player || !player.queue.current) return message.channel.send("`bruh nothing in queue.`");
        const {title, requester, uri, identifier, duration, thumbnail} = player.queue.current;

        let qEmbed = new MessageEmbed()
            .setTitle("**"+title+"**")
            .setURL(uri)
            .setColor("#B44874")
            .setFooter(`ShanerBot: Queue (${message.guild.name})`, client.user.displayAvatarURL())
            .setThumbnail(thumbnail)
        if (player.queueRepeat) qEmbed.setAuthor("🔁: Queue is Repeating")
        if (player.trackRepeat) qEmbed.setAuthor("🔂: Song is Repeating")
        if (player.queue.length > 1) {
            qEmbed.addField('-------------------------------------------------------------------------', '**Currently in queue:**')
            var i = 0;
            for (let {title,requester, duration} of player.queue) {
                ++i
                if (i === 1) continue
                qEmbed.addField("**["+String(i-1)+"]:** "+title+` - **__[${prettyMilliseconds(duration, {colonNotation: true, secondsDecimalDigits: 0})}]__**`, "Requested by: " + `<@${requester["id"]}>`)
            }
            qEmbed.addField('\u200b',`**__${i-1}__ song(s) queued | __${prettyMilliseconds(player.queue.duration-player.position, {colonNotation: true, secondsDecimalDigits: 0})}__ total length**`)
        }
        if(player.position > 0) {
            qEmbed.setDescription(`**Playing Now** (${prettyMilliseconds(player.position, {colonNotation: true, secondsDecimalDigits: 0})}/${prettyMilliseconds(duration, {colonNotation: true, secondsDecimalDigits: 0})}) \n Requested by: ` + `<@${requester["id"]}>`)
        } else {
            qEmbed.setDescription(`**Playing Now**\nRequested by: ` + `<@${requester["id"]}>`)           
        }
            message.channel.send({embed:qEmbed});  
    }
}