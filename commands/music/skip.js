const {RichEmbed} = require("discord.js")
module.exports = { 
    config: {
        name: "skip",
        description: "ok i'll skip a song.",
        usage: "ur skip",
        category: "music",
        accessableby: "Members",
        aliases: ["s"]
    },
    run: async (client, message, args) => {

        const player = client.music.players.get(message.guild.id);
        if (!player) return message.channel.send("`bruh, r u dumb? Not even gonna say anything.`");
        
        const {title, requester, uri, thumbnail} = player.queue[0];
        const {voiceChannel} = message.member;
        if(!voiceChannel || voiceChannel.id != player.voiceChannel.id) return message.channel.send("`im not skipping unless your in the same channel and kiss me.`");

        player.stop();
        const sEmbed = new RichEmbed()
        .setAuthor(`${message.author.name}: Skipping song`, message.author.displayAvatarURL)
        .setColor("#B44874")
        .setTitle("**"+title+"**")
        .setURL(uri)
        .setDescription(`Requested by: ${requester['username']}`)
        .setFooter(`ShanerBot: Skip (${message.guild.name})`, client.user.displayAvatarURL)
            message.channel.send({embed:sEmbed});  

    }
}