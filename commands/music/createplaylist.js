const User = require('../../models/user');
module.exports = { 
    config: {
        name: "createplaylist",
        description: "I will create a playlist.",
        usage: "ur createplaylist [playlist name]",
        category: "music",
        accessableby: "Members",
        aliases: ["cp"]
    },
    run: async (client, message, args) => {

        if (!args[0]) return message.reply(`Please tell me a name for a playlist.`).then(msg => msg.delete({timeout: 5000}));
        const foundUser = await User.findOne ({ userID: message.author.id });
        
        if (foundUser.playlists.length < 3){
            foundPlaylist = false
            foundUser.playlists.forEach(sPlaylist => {
                if (sPlaylist.name === args.join(" ")) {
                    foundPlaylist=true
                }
            })
            if (foundPlaylist) {
                message.react("❌");
                return message.reply(`sorry, that playlist name already exists.`).then(msg => msg.delete({timeout: 5000}));
            }
            if(args.join(" ").length > 10) {
                message.react("❌");
                return message.reply(`The playlist name must be less than 10 characters.`).then(msg => msg.delete({timeout: 5000}));
            }
            await User.findOneAndUpdate({userID:message.author.id}, {
                $push: {playlists: {                
                    name: args.join(" "),
                    public: false
                    }
                }   
            });
            message.react("✅");
            return message.reply(`created empty private playlist: __**${args.join(' ')}**__`).then(msg => msg.delete({timeout: 5000}));
        } else{
            message.react("❌");
            return message.reply(`sorry, you currently already have 3 playlists **${foundUser.playlists.forEach(sPlaylist => { 
                return sPlaylist.name 
            })})**. Either delete a playlist or add to another.`).then(msg => msg.delete({timeout: 10000}));
        }
    }
}