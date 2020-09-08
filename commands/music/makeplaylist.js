module.exports = { 
    config: {
        name: "makeplaylist",
        description: "I will create a playlist out of the current queue.",
        usage: "ur makeplaylist [playlist name]",
        category: "music",
        accessableby: "Members",
        aliases: ["mp", "clonequeue"]
    },
    run: async (client, message, args) => {
        var temp = client.playlistkeys.get(message.author.id)
        const player = client.music.players.get(message.guild.id);
        if (player.queue.empty) {
            return message.reply(`sorry, there has to be atleast one song in queue to clone it.)**. Either delete a playlist or add to already made playlist.`).then(msg => msg.delete({timeout: 5000}));
        }
        if (!args[0]) {
            return message.reply("Please provide a name for this playlist").then(msg => msg.delete({timeout: 5000}));
        }
        if (temp){
            if (temp.length == 3){
                return message.reply(`sorry, you currently already have 3 playlists **(${temp[0]}, ${temp[1]}, ${temp[2]})**. Either delete a playlist or add to already made playlist.`).then(msg => msg.delete({timeout: 5000}));
            } else{
                if (temp.includes(args.join(" "))){
                    return message.reply(`sorry, that playlist name already exists.`).then(msg => msg.delete({timeout: 5000}));
                }
                temp.push(args.join(' '))
            }
        } else{
            var temp = [args.join(' ')] 
        }
        client.playlistkeys.put(message.author.id, temp)
        client.playlist.put(message.author.id+args.join(" "), player.queue)
        return message.reply(`playlist : __**${args.join(" ")}**__ created containing ${player.queue.size} song(s).`).then(msg => msg.delete({timeout: 10000}));
    }
}