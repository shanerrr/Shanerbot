module.exports = { 
    config: {
        name: "join",
        description: "ok i join, hi.",
        usage: "ur join",
        category: "music",
        accessableby: "Members",
        aliases: []
    },
    run: async (client, message, args) => {

        const { voiceChannel } = message.member;
        if (!voiceChannel) return message.channel.send("`ur know i cant join if ur're not in channel, right?`");
        
        if (!client.music.players.get(message.guild.id)) {

            const permissions = voiceChannel.permissionsFor(client.user);
            if (!permissions.has("CONNECT")) return message.channel.send("😢 "+"`mannnn, i don't have the permission to join that channel.`");
            if (!permissions.has("SPEAK")) return message.channel.send("🤐 "+ "`dude, i can't talk in there man.`");       
            if (voiceChannel.full)
                if (permissions.has("CONNECT") && (permissions.has("MOVE_MEMBERS") || permissions.has("ADMINISTRATOR"))) {
                }else{
                    return message.channel.send("😭" + " ``there is not enough room for me man, ttyl.``");
                }

            client.music.players.spawn({
                guild: message.guild,
                textChannel: message.channel,
                voiceChannel
            });
        }
        else {
            const player = client.music.players.get(message.guild.id);
            if (player && (player.voiceChannel.id != voiceChannel.id)) return message.channel.send("`dude, nty. I'm already in a channel.`");
        }
        
            //if (player && (player.voiceChannel.id != voiceChannel.id)) return message.channel.send("`dude, nty. I'm already in a channel.`");
        
        // const player = client.music.players.get(message.guild.id);
        // if (!player){ 
        //     const player = client.music.players.spawn({
        //         guild: message.guild,
        //         textChannel: message.channel,
        //         voiceChannel
        //     });
        // }else {
        //     // player.switchChannel(voiceChannel, `${player.voiceChannel.id == voiceChannel.id ? false:true}`); 
        //     player.voiceChannel = voiceChannel;
        // }
    }
}