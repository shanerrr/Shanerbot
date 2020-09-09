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

        var temp = client.playlistkeys.get(message.author.id)
        if (temp){
            if (!args[0]) {
                message.react("❌");
                return message.reply(`Please state a name of a playlist in order to delete it.`).then(msg => msg.delete({timeout: 5000}));
            }
            if(!temp.includes(args.join(" ").toLowerCase())){
                message.react("❌");
                return message.reply(`You don't have a playlist named ${args.join(" ").toUpperCase()}. `).then(msg => msg.delete({timeout: 5000}));
            } else{
                try{
                    var indexof = temp.indexOf(args.join(" ").toLowerCase());
                    temp.splice(indexof, 1);
                } catch{
                    temp = [];
                }
                client.playlistkeys.put(message.author.id, temp);
                client.playlist.del(message.author.id+args.join(" ").toLowerCase());
                message.react("✅");
                return message.reply(`Playlist ${args.join(" ").toUpperCase()} deleted.`).then(msg => msg.delete({timeout: 5000}));
                
            }
        } else{
            message.react("❌");
            return message.reply(`You have no playlists.`).then(msg => msg.delete({timeout: 5000}));
        }
    }
}