module.exports = { 
    config: {
        name: "restart",
        description: "restart a playing song.",
        usage: "ur restart",
        category: "music",
        accessableby: "Members",
        aliases: ["replay"]
    },
    run: async (client, message, args) => {

        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send("`ok man, go restart your life.`").then(msg => msg.delete({timeout: 5000}));
        if (!player.queue.current || !player.queue.current.isSeekable) return message.react("❌");
        message.react("🔄");
        player.seek(0);

    }
}