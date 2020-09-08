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
        var temp = client.playlistkeys.get(message.author.id)
        if (temp){
            if (temp.length == 3){
                return message.reply(`sorry, you currently already have 3 playlists **(${temp[0].toUpperCase()}, ${temp[1].toUpperCase()}, ${temp[2].toUpperCase()})**. Either delete a playlist or add to another.`)
            } else{
                if (temp.includes(args.join(" ").toLowerCase())){
                    return message.reply(`sorry, that playlist name already exists.`)
                }
                temp.push(args.join(' ').toLowerCase())
            }
        } else{
            var temp = [args.join(' ').toLowerCase()] 
        }
        client.playlistkeys.put(message.author.id, temp)
        return message.reply(`created empty playlist: __**${args.join(' ').toUpperCase()}**__`);
    }
}