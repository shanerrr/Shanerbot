const {MessageEmbed} = require("discord.js")
module.exports = { 
    config: {
        name: "skip",
        description: "ok i'll skip a song.",
        usage: "ur skip",
        category: "music",
        accessableby: "Members",
        aliases: ["s", "next"]
    },
    run: async (client, message, args) => {

        const player = client.music.players.get(message.guild.id);
        if (!player || !player.queue[0]) return message.channel.send("`bruh, r u dumb? not even gonna say anything.`");
        
        const {channel} = message.member.voice;
        if(!channel || channel.id != player.voiceChannel.id) return message.channel.send("`im not skipping unless your in the same channel and kiss me.`");
        
        const {title, requester, uri} = player.queue[0];
        if (client.vote.get(message.guild.id)) return message.channel.send("``dude, react to the active vote to skip...``");

        if (player.voiceChannel.members.size>=3 && !message.member.hasPermission("MANAGE_ROLES") && !message.member.hasPermission("MANAGE_MESSAGES") && requester["id"]!=message.author.id) {
            client.vote.set(message.guild.id, 0);
            const asEmbed = new MessageEmbed()
                .setAuthor(`${message.author.username}: Voting to skip`, message.author.displayAvatarURL())
                .setURL(uri)
                .setColor("#B44874")
                .setTitle("**"+title+"**")
                .addField("Song requested by:", `<@${requester["id"]}>`, true)
                .addField("# of Votes Required:", `${Math.round(player.voiceChannel.members.size/2)}`, true)
                .setFooter(`ShanerBot: VoteToSkip (${message.guild.name})`, client.user.displayAvatarURL())
            skipembed = await message.channel.send(asEmbed);  
        
            skipembed.react("🗳️").then(() =>{
            const filter = (reaction, user) => reaction.emoji.name === '🗳️' && user.id != message.author.id;
            const collectorR = skipembed.createReactionCollector(filter, { max: 100, time: 30000 });
            collectorR.on('collect', r => {
                if (r.emoji.name === '🗳️') {
                    client.vote.set(message.guild.id, client.vote.get(message.guild.id)+1);
                    if (client.vote.get(message.guild.id)>= Math.round(player.voiceChannel.members.size/2)) {
                        client.vote.delete(message.guild.id);
                        skipembed.delete();
                        player.setTrackRepeat(false);
                        player.stop();
                        return message.react("⏭️")
                    }
                }
            });
            collectorR.on("end", (_, reason) => {
                if(["time"].includes(reason)) {
                    client.vote.delete(message.guild.id);
                    skipembed.delete();
                    return message.react("❌");
                }
            });
            }).catch(err => {
                skipembed.delete();
                message.react("❌")
                });
            }
        else {
            message.react("⏭️")
            player.setTrackRepeat(false);
            player.stop();
        }
    }
}