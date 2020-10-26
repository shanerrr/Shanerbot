module.exports = { 
    config: {
        name: "leave",
        description: "ok i leave bye.",
        usage: "ur leave",
        category: "music",
        accessableby: "Members",
        aliases: []
    },
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if(!player) return message.channel.send("`man ur know im not connected to a channel, idot.`").then(msg => msg.delete({timeout: 5000}));

        //checks if member is in same channel as bot or if adminstrator
        const {channel} = message.member.voice;
        if(!channel || channel.id !== player.voiceChannel) {
            if (message.member.hasPermission("ADMINSTRATOR")){
                //pass
            }
            else{
                message.react("❌");
                return message.channel.send("`haha, can't make me leave when im not in the same voice channel as you.`");
            }
        }
        player.disconnect();
        return message.react("😔")
    }
}