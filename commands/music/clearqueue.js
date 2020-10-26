module.exports = { 
    config: {
        name: "clearqueue",
        description: "i will clear an active queue.",
        usage: "ur clear",
        category: "music",
        accessableby: "Members",
        aliases: ["cq"]
    },
    run: async (client, message, args) => {

        const player = client.music.players.get(message.guild.id);
        player.setQueueRepeat(false);
        player.setTrackRepeat(false);
        if (!player) return message.react("❌");
        try {
            player.queue.removeFrom(1, player.queue.size);
            player.stop();
        } catch (error) {
            player.stop();
            //return message.react("❌");
        }
        return message.react("✅");
    }
}