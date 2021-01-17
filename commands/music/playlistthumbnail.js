const User = require('../../models/user');
module.exports = { 
    config: {
        name: "playlistthumbnail",
        description: "I will set a thumbnail for a playlist.",
        usage: "ur playlistthumbnail <image-link>",
        category: "music",
        accessableby: "Members",
        aliases: ["pt"]
    },
    run: async (client, message, args) => {

        if (!args[0]) return message.reply(`Please tell me a name for a playlist.`).then(msg => msg.delete({timeout: 5000}));
        const foundUser = await User.findOne ({ userID: message.author.id });
        let foundPlaylist = false;

        if (args[1]){
            await foundUser.playlists.forEach(async function(sPlaylist, idx, array) {
                if (sPlaylist.name === args[0]) {
                    foundPlaylist = true;
                    if (args[1].match(/\.(jpeg|jpg|gif|png)$/) != null){
                        await User.findOneAndUpdate({ userID:message.author.id, "playlists.name": sPlaylist.name}, {
                            "$set": {
                                "playlists.$.image": args[1]
                                }
                            },
                        );
                        message.react("✅");

                    } else return message.reply(`Thats not a valid image url`).then(msg => msg.delete({timeout: 5000}));
                }
                else if (idx === array.length - 1 && !foundPlaylist) return message.reply(`sorry, you dont have a playlist with that name.`).then(msg => msg.delete({timeout: 5000}));
            });
        } else return message.reply(`you need to also add the link of the image you want to set to this playlist.`).then(msg => msg.delete({timeout: 5000}));
        
       
    }
}