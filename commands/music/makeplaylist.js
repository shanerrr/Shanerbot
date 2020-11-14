module.exports = { 
    config: {
        name: "makeplaylist",
        description: "I will create a playlist out of the current queue.",
        usage: "ur makeplaylist [playlist name]",
        category: "music",
        accessableby: "Members",
        aliases: ["mp", "clonequeue", "cloneq", "cqueue"]
    },
    run: async (client, message, args) => {

        const player = client.manager.players.get(message.guild.id);
        const foundUser = await User.findOne({ userID: message.author.id });
        let objFound = false;

        if (!player) {
            message.react("❌");
            return message.reply(`dude, wtf?, im not even playing anything.`).then(msg => msg.delete({timeout: 5000}));}
        else if (!player.queue.current) {
            message.react("❌");
            return message.reply(`ok man! r u dumb? tell me? no songs play rn..... smh`).then(msg => msg.delete({timeout: 5000}));}
        else if (!args[0]) {
            message.react("❌");
            return message.reply(`Tell me a name for a playlist.`).then(msg => msg.delete({timeout: 5000}));}
        else if (foundUser.playlists.length == 3){
            message.react("❌");
            return message.reply(`You already have three playlists. Sorry bro :(`).then(msg => msg.delete({timeout: 5000}));}
        else if (args.join(" ").length > 10) {
            message.react("❌");
            return message.reply(`The playlist name must be less than 10 characters.`).then(msg => msg.delete({timeout: 5000}));
        }
        await foundUser.playlists.forEach(async function(sPlaylist, idx, array) {
            if (sPlaylist.name === args.join(" ")){
                objFound = true;
                message.react("❌");
                return message.reply(`A playlist with this name already exists.`).then(msg => msg.delete({timeout: 5000}));
            }
            else if (idx === array.length - 1 && !objFound){
                if (player.queue.totalSize <= 15){
                    const {title, uri, identifier, duration} = player.queue.current;
                    await User.findOneAndUpdate({ userID:message.author.id, "playlists.name": sPlaylist.name}, { //for current playing song
                        "$push": {
                            "playlists.$.songs": {
                                name: title,
                                duration,
                                uri,
                                identifier
                                }
                            }
                        });
                    await player.queue.forEach(async song => {
                        const {title, uri, identifier, duration} = song;
                        await User.findOneAndUpdate({ userID:message.author.id, "playlists.name": sPlaylist.name}, { //for current playing song
                            "$push": {
                                "playlists.$.songs": {
                                    name: title,
                                    duration,
                                    uri,
                                    identifier
                                    }
                                }
                        });
                    });
                    message.react("✅");
                    return message.reply(`playlist : __**${args.join(" ")}**__ created containing ${player.queue.totalSize} song(s).`).then(msg => msg.delete({timeout: 10000}));
                }
                else{
                    message.react("❌");
                    return message.reply(`sorry bro, i can only add 15 songs to a playlist. There are currently ${player.queue.totalSize} in the current queue.`).then(msg => msg.delete({timeout: 5000}));
                }
            }        
        });       
        if (temp){
            if (temp.length == 3){
                message.react("❌");
                return message.reply(`sorry, you currently already have 3 playlists **(${temp[0].toUpperCase()}, ${temp[1].toUpperCase()}, ${temp[2].toUpperCase()})**. Either delete a playlist or add to already made playlist.`).then(msg => msg.delete({timeout: 5000}));
            } else{
                if (temp.includes(args.join(" ").toLowerCase())){
                    message.react("❌");
                    return message.reply(`sorry, that playlist name already exists.`).then(msg => msg.delete({timeout: 5000}));
                }

                temp.push(args.join(' ').toLowerCase())
            }
        } else{
            if(args.join(" ").length > 10) {
                message.react("❌");
                return message.reply(`The playlist name must be less than 10 characters.`).then(msg => msg.delete({timeout: 5000}));
            }
            var temp = [args.join(' ').toLowerCase()] 
        }
        client.playlistkeys.put(message.author.id, temp)
        client.playlist.put(message.author.id+args.join(" ").toLowerCase(), JSON.stringify(player.queue))
        message.react("✅");
        return message.reply(`playlist : __**${args.join(" ").toUpperCase()}**__ created containing ${player.queue.size} song(s).`).then(msg => msg.delete({timeout: 10000}));
    }
}