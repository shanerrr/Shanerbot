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
        
        var player = client.manager.players.get(message.guild.id);
        let {channel} = message.member.voice;
        if (args.join(" ")) {
            channel = message.guild.channels.cache.find(VoiceChannel => VoiceChannel.name === args.join(" "));
            if (!channel) return message.react("❌");
        }
        else {
            if (!channel) return message.channel.send("`ur know i cant join if ur're not in channel, right?`");
        }
        
        //if the player is not in a channel already, it'll create a player instance for that channel
        if (!player) {
            let permissions = channel.permissionsFor(client.user);
            if (!permissions.has("CONNECT")) return message.channel.send("😢 "+"`mannnn, i don't have the permission to join that channel.`");
            if (!permissions.has("SPEAK")) return message.channel.send("🤐 "+ "`dude, i can't talk in there man.`");       
            if (channel.full)
                if (permissions.has("CONNECT") && (permissions.has("MOVE_MEMBERS") || permissions.has("ADMINISTRATOR"))) {
                }else{
                    return message.channel.send("😭" + " ``there is not enough room for me man, ttyl.``");
                }
            message.react("😀");    
            player = client.manager.create({
                    guild: message.guild.id,
                    voiceChannel: channel.id,
                    textChannel: message.channel.id,
            });
            player.connect();
        }
        //If the bot is already connected to a channel error
        else {
            if (player && (player.voiceChannel != channel.id)) return message.channel.send("😒 "+"`dude, nty. I'm already in a channel that i'm having fun in.`").then(msg => msg.delete({timeout: 5000}));
            //else return message.channel.send("`dude? I'm already in the channel.....`").then(msg => msg.delete({timeout: 5000}));
        }
        
    }
}