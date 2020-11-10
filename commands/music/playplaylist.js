const {MessageEmbed} = require("discord.js");
const User = require('../../models/user');
module.exports = { 
    config: {
        name: "playplaylist",
        description: "I will play a playlist.",
        usage: "ur playplaylist",
        category: "music",
        accessableby: "Members",
        aliases: ["pp"]
    },
    run: async (client, message, args) => {

        const foundUser = await User.findOne ({ userID: message.author.id });
        let player = client.manager.players.get(message.guild.id);
        let objFound = false;

        if (!args[0]) {
            message.react("❌");
            return message.reply("please tell me what playlist to play.").then(msg => msg.delete({timeout: 5000}));
        }
        await foundUser.playlists.forEach(async function(sPlaylist, idx, array) {
            if (sPlaylist.name === args.join(" ") && sPlaylist.songs.length){
                objFound = true;
                if(!player){
                    let commandfile = client.commands.get("join")
                    if(commandfile) commandfile.run(client, message, [])
                    player = client.manager.players.get(message.guild.id);
                    if (!player) return message.react("❌");
                    return await getMusic(sPlaylist.songs, true);   
                }else{
                    player.setQueueRepeat(false);
                    if((client.channels.cache.get(player.voiceChannel).members.size<3 || message.member.hasPermission('MOVE_MEMBERS')) && player.queue.totalSize>0) {
                        const pEmbed =  new MessageEmbed()
                        .setColor("#B44874")
                        .setTitle("**"+"Adding Playlist: "+"__"+args.join(" ").toUpperCase()+"__"+"**")
                        .setDescription("React to this message with one of the options below to state what to do with the following playlist.")
                        .addField("\u200b","🎶: Will **__add__** the playlist to the current queue. (Queue will not be looping)", false)
                        .addField("\u200b", "⏏️: Will **__clear__** the current queue and start playing the playlist. (Queue will be looping)", false)
                        .addField("\u200b", "❌: Will **__cancel__** this request.", false)
                        .setFooter(`ShanerBot: QueueManager (${message.guild.name})`, client.user.displayAvatarURL())
                        plembed = await message.channel.send(pEmbed).then(plembed => {
                            plembed.react("🎶");
                            plembed.react("⏏️");
                            plembed.react("❌").then(()=>{
                                const filter = (reaction, user) => (reaction.emoji.name === '🎶' || reaction.emoji.name === '⏏️' || reaction.emoji.name === '❌') && user.id == message.author.id;
                                const collectorR = plembed.createReactionCollector(filter, { max: 1, time: 15000 });
                                collectorR.on('collect', async r => {
                                    if (r.emoji.name === '🎶') {
                                        plembed.delete();
                                        message.react("🎶");
                                        if (sPlaylist.songs.length + player.queue.size > 20) {
                                            message.react("❌");
                                            return message.reply(`Sorry, the queue can only store 20 songs at a time.`).then(msg => msg.delete({timeout: 5000}));
                                        }
                                        return await getMusic(sPlaylist.songs, false);
                                    }
                                    if (r.emoji.name === '⏏️') {
                                        player.queue.clear();  
                                        player.stop();                                      
                                        plembed.delete();
                                        message.react("⏏️");
                                        return await getMusic(sPlaylist.songs, true);
                                    }
                                    if (r.emoji.name === '❌') {
                                        return collectorR.stop("time") 
                                    }
                                });
                                collectorR.on("end", async (_, reason) => {
                                    if(["time"].includes(reason)) {
                                        plembed.delete();
                                        return message.react("❌");
                                    }
                                });
                                }).catch(async err => {
                                    plembed.delete();
                                    return message.react("❌");
                                    });
                            });
                    }else {
                        message.react("✅");
                        message.reply(`your playlist: **__${sPlaylist.name}__** has been added to the queue.`).then(msg => msg.delete({timeout: 5000}));
                        return await getMusic(sPlaylist.songs, false);
                    }
                }                
            } else if (!sPlaylist.songs.length){
                console.log(sPlaylist.songs.length)
                return message.reply("you're trying to play an empty playlist you dumbo.").then(msg => msg.delete({timeout: 5000}));
            }
            if (idx === array.length - 1 && !objFound){ 
                message.react("❌");
                return message.reply(`That playlist doesn't exist, man....`).then(msg => msg.delete({timeout: 5000}));
            }        
        });

async function getMusic(playlist, repeat) {
    await playlist.forEach(async song => {
        let res;
        try {
            // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
            res = await client.manager.search(song.uri, message.author);
            // Check the load type as this command is not that advanced for basics
            if (res.loadType === "LOAD_FAILED") throw res.exception;
        } catch (err) {
            return message.reply(`there was an error while searching: ${err.message}`);
        }
        await player.queue.add(res.tracks[0]);
        
        // Checks if the client should play the track if it's the first one added
        if (!player.playing && !player.paused && !player.queue.size) player.play()    
        player.setQueueRepeat(repeat);
    });
}}}
