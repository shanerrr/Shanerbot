module.exports = { 
    config: {
        name: "join",
        description: "ok i join, hi",
        usage: "ur join",
        category: "music",
        accessableby: "Members",
        aliases: []
    },
    run: async (client, message, args) => {

        const { voiceChannel } = message.member;
        if (!voiceChannel) return message.channel.send("`ur know i cant join if ur're not in channel, right?`");

        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has("CONNECT")) return message.channel.send("😢 "+"`mannnn, i don't have the permission to join that channel.`");
        if (!permissions.has("SPEAK")) return message.channel.send("🤐 "+ "`dude, i can't talk in here man.`");

        const { voiceChannel } = message.member;
        const player = client.music.players.spawn({
            guild: message.guild,
            textChannel: message.channel,
            voiceChannel
        });
        

    }
}