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

        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.react("❌");
        if (player.queue.totalSize > 0 && !message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send("sorry bro, you dont have that kind of power to stop me playing music.").then(msg => msg.delete({timeout: 5000}));
            return message.react("❌");
        }
        player.setTrackRepeat(false);
        player.setQueueRepeat(false);
        player.queue.clear();
        player.stop();
        return message.react("✅");
    }
}