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

        const player = client.manager.players.get(message.guild.id);
        if (message.member.hasPermission("ADMINSTRATOR")){
            player.setQueueRepeat(false);
            player.setTrackRepeat(false);
            if (!player) return message.react("❌");
            try {
                player.queue.removeFrom(1, player.queue.size);
                player.stop();
            } catch (error) {
                player.stop();
            }
            return message.react("✅");
        }
        message.react("❌");
        return message.channel.send("`sorry bro, you're kinda cringe if you think im gonna clear the queue for you.`").then(msg => msg.delete({timeout: 5000}));
    }
}