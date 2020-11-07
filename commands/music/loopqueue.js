module.exports = { 
    config: {
        name: "loopqueue",
        description: "i loop an active queue forever or stop a forever looping queue.",
        usage: "ur loopqueue",
        category: "music",
        accessableby: "Members",
        aliases: ["loopall", "repeatall", "repeatqueue"]
    },
    run: async (client, message, args) => {

        const player = client.manager.players.get(message.guild.id);

        if (!player) return message.channel.send("`man ur know im not even connected to a channel, idot.`");
        if (!player.playing) return message.channel.send("`man ur know im not even playing a song.`");

        const {channel} = message.member.voice;
        if(!channel || channel.id !== player.voiceChannel) return message.channel.send("`no song looping unless youre in the same channel as me`");

        player.setQueueRepeat(!player.queueRepeat);
        if (player.queueRepeat) {
            return message.react("🔁");
        } else{
            return message.react("❌");
        }
    }
}