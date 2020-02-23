const prettyMilliseconds = require('pretty-ms');
const {RichEmbed} = require("discord.js")

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

        const player = client.music.players.get(message.guild.id);
        if(!player || !player.queue[0]) return message.channel.send("`bruh nothing in queue.`");
        const {title, requester, uri, thumbnail, duration} = player.queue[0];

        let qEmbed = new RichEmbed()
        .setTitle("**"+title+"**")
        .setURL(uri)
        .setColor("#B44874")
        .setFooter(`ShanerBot: Queue (${message.guild.name})`, client.user.displayAvatarURL)
        .setThumbnail(thumbnail)
        if (player.queue.length > 1) {
            qEmbed.addField('-------------------------------------------------------------------------', '**Currently in queue:**')
            var i = 0;
            var totallength = 0;
            for (let {title,requester, duration} of player.queue) {
                ++i
                if (i === 1) continue
                totallength = totallength + duration
                qEmbed.addField("**["+String(i-1)+"]:** "+title+` - **[${prettyMilliseconds(duration, {colonNotation: true, secondsDecimalDigits: 0})}]**`, "Requested by: " + requester['username'])
            }
            qEmbed.addField('\u200b',`**${i-1} songs queued | ${prettyMilliseconds(totallength, {colonNotation: true, secondsDecimalDigits: 0})} queue length **`)
        }
        if(player.position > 0) {
            qEmbed.setDescription(`**Playing Now** (${prettyMilliseconds(player.position, {colonNotation: true, secondsDecimalDigits: 0})}/${prettyMilliseconds(duration, {colonNotation: true, secondsDecimalDigits: 0})}) \n Requested by: ` + requester['username'])
        } else {
            qEmbed.setDescription(`**Playing Now**\nRequested by: ` + requester['username'])           
        }
            message.channel.send({embed:qEmbed});  
    }
}