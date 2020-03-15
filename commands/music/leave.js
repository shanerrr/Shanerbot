module.exports = { 
    config: {
        name: "leave",
        description: "ok i leave bye.",
        usage: "ur leave",
        category: "music",
        accessableby: "Members",
        aliases: ["disconnect"]
    },
    run: async (client, message, args) => {
        const player = client.music.players.get(message.guild.id);

        if(!player) return message.channel.send("`man ur know im not connected to a channel, idot.`");

        // const {channel} = message.member.voice; 
        // if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send("`haha, can't kick me when im not in the same voice channel as you.`");

        client.music.players.destroy(message.guild.id);
        return message.react("😔")
    }
}