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

        const player = client.music.players.get(message.guild.id);
        var temp = client.playlistkeys.get(message.author.id);
        if (!player) {
            message.react("❌");
            return message.reply(`dude, wtf?, im not even playing anything.`).then(msg => msg.delete({timeout: 5000}));}
        if (player.queue.empty) {
            message.react("❌");
            return message.reply(`ok man! I added this queue of these amazing songs that are playing right now to your playlist!!!`).then(msg => msg.delete({timeout: 5000}));}
        if (!args[0]) {
            message.react("❌");
            return message.reply(`Tell me a playlist to add the song to`).then(msg => msg.delete({timeout: 5000}));}
        if(!temp.includes(args.join(" ").toLowerCase())) {
            message.react("❌");
            return message.reply(`That playlist doesn't exist, man....`).then(msg => msg.delete({timeout: 5000}));
        }else{
            var playlist;
            try{
                playlist = JSON.parse(client.playlist.get(message.author.id+args.join(" ").toLowerCase()));
            } catch{
                playlist = false;
            }
            if(!playlist) {
                client.playlist.put(message.author.id+args.join(" ").toLowerCase(), JSON.stringify(player.queue));
                return message.react("✅");
            } else{
                // if(playlist.length){

                // }else{
                    
                // }
                if(playlist.length + player.queue.size <= 14) {
                    player.queue.forEach((track) => {
                        playlist.push(track)
                    });
                    client.playlist.put(message.author.id+args.join(" ").toLowerCase(), JSON.stringify(playlist));
                    return message.react("✅");
                }else{
                    message.react("❌");
                    return message.reply(`A playlist can only hold 15 songs.`).then(msg => msg.delete({timeout: 5000}));
                }
            }
        }
    }
}