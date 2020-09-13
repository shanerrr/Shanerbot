const {MessageEmbed} = require("discord.js")
module.exports = { 
    config: {
        name: "stop",
        description: "clears queue, and stops playing any songs.",
        usage: "ur stop",
        category: "music",
        accessableby: "Members",
        aliases: []
    },
    run: async (client, message, args) => {

        const player = client.music.players.get(message.guild.id);
        if (!player) return message.react("❌");
        player.setTrackRepeat(false);
        player.setQueueRepeat(false);    
        try {
            player.queue.removeFrom(1, player.queue.size);
            player.stop();
        } catch (error) {
            player.stop();
        }
        return message.react("✅");
    }
}