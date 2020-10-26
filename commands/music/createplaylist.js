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
        var temp = client.playlistkeys.get(message.author.id)
        if (temp){
            if (temp.length == 3){
                message.react("❌");
                return message.reply(`sorry, you currently already have 3 playlists **(${temp[0].toUpperCase()}, ${temp[1].toUpperCase()}, ${temp[2].toUpperCase()})**. Either delete a playlist or add to another.`).then(msg => msg.delete({timeout: 10000}));
            } else{
                if (temp.includes(args.join(" ").toLowerCase())){
                    message.react("❌");
                    return message.reply(`sorry, that playlist name already exists.`).then(msg => msg.delete({timeout: 5000}));
                }
                if(args.join(" ").length > 10) {
                    message.react("❌");
                    return message.reply(`The playlist name must be less than 10 characters.`).then(msg => msg.delete({timeout: 5000}));
                }
                temp.push(args.join(' ').toLowerCase())
            }
        } else{
            if(args.join(" ").length > 10) {
                message.react("❌");
                return message.reply(`The playlist name must be less than 10 characters.`).then(msg => msg.delete({timeout: 5000}));
            }
            temp = []
            temp.push(args.join(' ').toLowerCase()); 
        }
        client.playlistkeys.put(message.author.id, temp)
        message.react("✅");
        return message.reply(`created empty playlist: __**${args.join(' ').toUpperCase()}**__`).then(msg => msg.delete({timeout: 5000}));
    }
}