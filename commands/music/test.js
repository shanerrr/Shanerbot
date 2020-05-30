module.exports = { 
    config: {
        name: "test",
        description: "i will clear an active queue.",
        usage: "ur clear",
        category: "music",
        accessableby: "Members",
        aliases: []
    },
    run: async (client, message, args) => {

        const player = client.music.players.get(message.guild.id);
        if (!player) return message.react("❌");
        client.database.put(player.voiceChannel.id, args[0]);
        console.log(client.database.get(player.voiceChannel.id));
        try {
            console.log(player.textChannel.name)
            console.log(player.voiceChannel.name)
        } catch (error) {
            return message.react("❌");
        }
        return message.react("✅");
    }
}