module.exports = { 
    config: {
        name: "clear",
        description: "i will clear an active queue.",
        usage: "ur clear",
        category: "music",
        accessableby: "Members",
        aliases: []
    },
    run: async (client, message, args) => {

        const player = client.music.players.get(message.guild.id);
        if (!player) return message.react("❌");
        try {
            player.queue.removeFrom(1, player.queue.size);
            player.stop();
        } catch (error) {
            return message.react("❌");
        }
        return message.react("✅");
    }
}