module.exports = { 
    config: {
        name: "join",
        description: "ok i join, hi",
        usage: "ur join",
        category: "music",
        accessableby: "Members",
        aliases: ["join"]
    },
    run: async (client, message, args) => {
        const { voiceChannel } = message.member;
        const player = client.music.players.get(message.guild.id);

        if(!player) return message.channel.send("No song/s currently playing in this guild.");
        if(!voiceChannel || voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in a voice channel to use the leave command.");

        client.music.players.destroy(message.guild.id);
        return message.channel.send("😔 ``"+`ok i left: **${voiceChannel.name}**`+"``");
    }
}