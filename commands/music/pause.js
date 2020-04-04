module.exports = { 
    config: {
        name: "pause",
        description: "ok i'll pause your dumb songs.",
        usage: "ur pause",
        category: "music",
        accessableby: "Members",
        aliases: ["resume"]
    },
    run: async (client, message, args) => {

        const player = client.music.players.get(message.guild.id);
        if (!player) return message.channel.send("`no music playing so ill just pause myself.`");
        
        player.pause(player.playing);
        if (player.playing) {
            return message.react("▶️");
            
        }
        return message.react("⏸️");
    }
}