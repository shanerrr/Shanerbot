const mongoose = require("mongoose");
const User = require('../../models/user');
const Playlist = require('../../models/playlist');
const Song = require('../../models/song');
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
        const foundUser = await User.findOne ({ userID: message.author.id });

        console.log(foundUser);

        if (!player) {
            message.react("❌");
            return message.reply(`dude, wtf?, im not even playing anything.`).then(msg => msg.delete({timeout: 5000}));
        }
        if (!player.queue.size) {
            message.react("❌");
            return message.reply(`ok man! I added this song that is totally playing to your playlist!!!`).then(msg => msg.delete({timeout: 5000}));
        }
        if (!args[0]) {
            message.react("❌");
            return message.reply(`Tell me a playlist to add the song to`).then(msg => msg.delete({timeout: 5000}));
        }
        await foundUser.playlists.forEach(sPlaylist => {
            if (sPlaylist.name === args.join(" ")){
                if (sPlaylist.songs.length < 15){
                    const {title, uri, identifier, duration} = player.queue.current;
                    const newSong = new Song({
                        name: title,
                        duration,
                        uri,
                        identifier
                    });
                    await newSong.save();
                    return message.react("✅");
                }
                else{
                    message.react("❌");
                    return message.reply(`This playlist already has the limit of 15 songs.`).then(msg => msg.delete({timeout: 5000}));
                }

            }else{
                message.react("❌");
                return message.reply(`That playlist doesn't exist, man....`).then(msg => msg.delete({timeout: 5000}));
            }
            
        });

        // if(!temp.includes(args.join(" ").toLowerCase())) {
        //     message.react("❌");
        //     return message.reply(`That playlist doesn't exist, man....`).then(msg => msg.delete({timeout: 5000}));
        // }else{
        //     var playlist;
        //     try{
        //         playlist = JSON.parse(client.playlist.get(message.author.id+args.join(" ").toLowerCase()));
        //     }catch{
        //         playlist = false
        //     }
        //     if(!playlist) {
        //         client.playlist.put(message.author.id+args.join(" ").toLowerCase(), JSON.stringify(player.queue[0]));
        //         return message.react("✅");
        //     }else{
        //         if((playlist.length || 1) <= 14) {
        //             try{
        //                 playlist.push(player.queue[0]);
        //                 client.playlist.put(message.author.id+args.join(" ").toLowerCase(), JSON.stringify(playlist));
        //             }catch{
        //                 var pltemp = [];
        //                 pltemp.push(playlist);
        //                 pltemp.push(player.queue[0]);
        //                 client.playlist.put(message.author.id+args.join(" ").toLowerCase(), JSON.stringify(pltemp));
        //             }
        //             return message.react("✅");
        //         }else{
        //             message.react("❌");
        //             return message.reply(`This playlist already has the limit of 15 songs.`).then(msg => msg.delete({timeout: 5000}));
        //         }
        //     }
        // }
    }
}