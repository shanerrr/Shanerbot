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
        var temp = client.playlistkeys.get(message.author.id)
        const player = client.music.players.get(message.guild.id);
        if(!player) {
            message.react("❌");
            return message.reply(`hey man, r u ok? Im not even playing anything right now.`).then(msg => msg.delete({timeout: 5000}));
        }
        if (player.queue.empty) {
            message.react("❌");
            return message.reply(`sorry, there has to be atleast one song in queue to clone it.)**. Either delete a playlist or add to already made playlist.`).then(msg => msg.delete({timeout: 10000}));
        }
        if (!args[0]) {
            message.react("❌");
            return message.reply("Please provide a name for this playlist").then(msg => msg.delete({timeout: 5000}));
        }
        if (temp){
            if (temp.length == 3){
                message.react("❌");
                return message.reply(`sorry, you currently already have 3 playlists **(${temp[0].toUpperCase()}, ${temp[1].toUpperCase()}, ${temp[2].toUpperCase()})**. Either delete a playlist or add to already made playlist.`).then(msg => msg.delete({timeout: 5000}));
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
            var temp = [args.join(' ').toLowerCase()] 
        }
        client.playlistkeys.put(message.author.id, temp)
        client.playlist.put(message.author.id+args.join(" ").toLowerCase(), JSON.stringify(player.queue))
        message.react("✅");
        return message.reply(`playlist : __**${args.join(" ").toUpperCase()}**__ created containing ${player.queue.size} song(s).`).then(msg => msg.delete({timeout: 10000}));
    }
}