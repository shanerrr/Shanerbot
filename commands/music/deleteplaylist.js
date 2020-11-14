const User = require('../../models/user');
module.exports = { 
    config: {
        name: "deleteplaylist",
        description: "I will delete a playlist",
        usage: "ur dp <playlist name>",
        category: "music",
        accessableby: "Members",
        aliases: ["dp"]
    },
    run: async (client, message, args) => {

        if (!args[0]) return message.reply(`Please specify which playlist to delete.`).then(msg => msg.delete({timeout: 5000}));
        const foundUser = await User.findOne ({ userID: message.author.id });
        let numOfSongs;
        let objFound = false;

        await foundUser.playlists.forEach(async function(sPlaylist, idx, array) {
            if (sPlaylist.name === args.join(" ")){
                numOfSongs = sPlaylist.songs.length;
                objFound = true;
                await User.findOneAndUpdate({ userID:message.author.id, "playlists.name": sPlaylist.name}, {
                    $pull: {playlists: {                
                        name: args.join(" ")}
                }});
                message.react("✅");
                return message.reply(`Playlist: **__${args.join(" ")}__** deleted containing **__${numOfSongs}__** songs. `).then(msg => msg.delete({timeout: 5000}));
            }
            if (idx === array.length - 1 && !objFound){ 
                message.react("❌");
                return message.reply(`You don't have a playlist named **__${args.join(" ")}__**. `).then(msg => msg.delete({timeout: 5000}));
            }        
        });
    }
}