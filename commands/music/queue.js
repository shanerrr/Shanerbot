const {Utils} = require("erela.js")
const {RichEmbed} = require("discord.js")

module.exports = { 
    config: {
        name: "queue",
        description: "ok i show you songs",
        usage: "ur queue",
        category: "music",
        accessableby: "Members",
        aliases: ["queue", "q", "np"]
    },
    run: async (client, message, args) => {

        const player = client.music.players.get(message.guild.id);
        if(!player || !player.queue[0]) return message.channel.send("`bruh nothing in queue.`");
        const {title, requester, uri, thumbnail} = player.queue[0];

        let qEmbed = new RichEmbed()
        .setTitle("**"+title+"**")
        .setURL(uri)
        .setDescription("**Playing Now** \n Requested by: " + requester['username'])
        .setColor("#B44874")
        .setFooter(`ShanerBot: Queue (${message.guild.name})`, client.user.displayAvatarURL)
        .setThumbnail(thumbnail)
        if (player.queue.length > 1) {
            qEmbed.addField('-------------------------------------------------------------------------', '**Currently in queue:**')
            var i = 0;
            for (let {title,requester} of player.queue) {
                ++i
                if (i === 1) continue
                qEmbed.addField("**["+String(i-1)+"]** "+title, "Requested by: " + requester['username'])
            }
        }
            message.channel.send({embed:qEmbed});  
    }
}