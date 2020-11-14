module.exports = { 
    config: {
        name: "loop",
        description: "i loop a playing song forever or stop a forever looping song.",
        usage: "ur loop",
        category: "music",
        accessableby: "Members",
        aliases: ["repeat"]
    },
    run: async (client, message, args) => {

        const player = client.manager.players.get(message.guild.id);

        if (!player) return message.channel.send("`man ur know im not even connected to a channel, idot.`").then(msg => msg.delete({timeout: 5000}));
        if (!player.playing) return message.channel.send("`man ur know im not even playing a song.`").then(msg => msg.delete({timeout: 5000}));

        const {channel} = message.member.voice;
        if(!channel || channel.id !== player.voiceChannel) return message.channel.send("`no song looping unless youre in the same channel as me`").then(msg => msg.delete({timeout: 5000}));

        player.setTrackRepeat(!player.trackRepeat);
        if (player.trackRepeat) {
            return message.react("🔂");
        } else{
            return message.reply("this song is no longer looping.").then(msg => msg.delete({timeout: 5000}));
        }
    }
}