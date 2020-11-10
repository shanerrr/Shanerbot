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
            player.setTrackRepeat(false);
            player.setQueueRepeat(false);    
            player.queue.clear();
            return message.react("✅");
        }
        message.react("❌");
        return message.channel.send("`sorry bro, you're kinda cringe if you think im gonna clear the queue for you.`").then(msg => msg.delete({timeout: 5000}));
    }
}