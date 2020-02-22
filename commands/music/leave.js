module.exports = { 
    config: {
        name: "leave",
        description: "ok i leave bye",
        usage: "ur leave",
        category: "music",
        accessableby: "Members",
        aliases: ["l"]
    },
    run: async (client, message, args) => {
        const player = client.music.players.get(message.guild.id);

        if(!player) return message.channel.send("`man ur know im not connected to a channel, idot.`");

        const { voiceChannel } = message.member;
        //if(!voiceChannel || voiceChannel.id !== player.voiceChannel.id) return message.channel.send("`man ur know im not connected to a channel, idot.`");

        client.music.players.destroy(message.guild.id);
        return message.channel.send("``"+`ok i left: ${voiceChannel.name}`+"`` 😔");
    }
}