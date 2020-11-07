const User = require('../../models/user');
module.exports = { 
    config: {
        name: "addqueueto",
        description: "i will add a current playing queue to a specified playlist.",
        usage: "ur addqueueto <playlist>",
        category: "music",
        accessableby: "Members",
        aliases: ["aqt","aqueueto"]
    },
    run: async (client, message, args) => {

        const player = client.manager.players.get(message.guild.id);
        const foundUser = await User.findOne({ userID: message.author.id });
        let objFound = false;

        if (!player) {
            message.react("❌");
            return message.reply(`dude, wtf?, im not even playing anything.`).then(msg => msg.delete({timeout: 5000}));}
        if (!player.queue.current) {
            message.react("❌");
            return message.reply(`ok man! I added this queue of these amazing songs that are playing right now to your playlist!!!`).then(msg => msg.delete({timeout: 5000}));}
        if (!args[0]) {
            message.react("❌");
            return message.reply(`Tell me a playlist to add the song to`).then(msg => msg.delete({timeout: 5000}));}
        
        await foundUser.playlists.forEach(async function(sPlaylist, idx, array) {
            if (sPlaylist.name === args.join(" ")){
                objFound = true;
                if (sPlaylist.songs.length + player.queue.size <= 15){
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
                    })
                    return message.react("✅");
                }
                else{
                    message.react("❌");
                    return message.reply(`This playlist can only have a limit of 15 songs.`).then(msg => msg.delete({timeout: 5000}));
                }
            }
            if (idx === array.length - 1 && !objFound){ 
                message.react("❌");
                return message.reply(`That playlist doesn't exist, man....`).then(msg => msg.delete({timeout: 5000}));
            }        
        });    
    }
}