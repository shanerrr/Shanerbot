const User = require('../../models/user');
module.exports = { 
    config: {
        name: "addsongto",
        description: "i will add current playing song to a specified playlist.",
        usage: "ur addsongto <playlist>",
        category: "music",
        accessableby: "Members",
        aliases: ["ast","asongto"]
    },
    run: async (client, message, args) => {

        const player = client.manager.players.get(message.guild.id);
        const foundUser = await User.findOne({ userID: message.author.id });
        let objFound = false;

        if (!player) {
            message.react("❌");
            return message.reply(`dude, wtf?, im not even playing anything.`).then(msg => msg.delete({timeout: 5000}));
        }
        if (!player.queue.current) {
            message.react("❌");
            return message.reply(`ok man! I added this song that is totally playing to your playlist!!!`).then(msg => msg.delete({timeout: 5000}));
        }
        if (!args[0]) {
            message.react("❌");
            return message.reply(`Tell me a playlist to add the song to`).then(msg => msg.delete({timeout: 5000}));
        }
        await foundUser.playlists.forEach(async function(sPlaylist, idx, array) {
            if (sPlaylist.name === args.join(" ")){
                objFound = true;
                if (sPlaylist.songs.length < 15){
                    const {title, uri, identifier, duration} = player.queue.current;
                    await User.findOneAndUpdate({ userID:message.author.id, "playlists.name": sPlaylist.name}, {
                        "$push": {
                            "playlists.$.songs": {
                                name: title,
                                duration,
                                uri,
                                identifier
                                }
                            }
                        });
                    return message.react("✅");
                }
                else{
                    message.react("❌");
                    return message.reply(`This playlist already has the limit of 15 songs.`).then(msg => msg.delete({timeout: 5000}));
                }
            }
            if (idx === array.length - 1 && !objFound){ 
                message.react("❌");
                return message.reply(`That playlist doesn't exist, man....`).then(msg => msg.delete({timeout: 5000}));
            }        
        });
    }
}