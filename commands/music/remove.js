module.exports = { 
    config: {
        name: "remove",
        description: "i will remove a song from queue",
        usage: "ur remove (pos in queue)",
        category: "music",
        accessableby: "Members",
        aliases: ["rm", "removefrom"]
    },
    run: async (client, message, args) => {

        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.react("❌");
        if (!args[0] || isNaN(args[0]) || Number(args[0])<1) return message.react("❌");
        if (Number(args[0]) > player.queue.size) return message.react("❌");

        player.queue.remove(Number(args[0]));
        return message.react("✅");
    }
}