const {MessageEmbed} = require("discord.js")
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
        var player = client.music.players.get(message.guild.id);
        if (!args[0]) {
            return message.reply("please tell me what playlist to play.").then(msg => msg.delete({timeout: 5000}));
        }
        if (!player) {
            let commandfile = client.commands.get("join") || client.commands.get(client.aliases.get("join"))
            if(commandfile) commandfile.run(client, message, "")
            player = client.music.players.get(message.guild.id);
        } else{
            if(player.voiceChannel.members.size<3) {
                const pEmbed = new MessageEmbed()
                .setColor("#B44874")
                .setTitle("**"+"Adding Playlist: "+"__"+args.join(" ")+"__"+"**")
                .setDescription("React to this message with one of the options below to state what to do with the following playlist.")
                .addField("🎶:","Will add the playlist to the current queue. (Queue will not be looping)", false)
                .addField("⏏️:", "Will clear the current queue and start playing the playlist. (Queue will be looping)", false)
                .setFooter(`ShanerBot: QueueManager (${message.guild.name})`, client.user.displayAvatarURL())
                plembed = await message.channel.send(pEmbed);
                plembed.react("🎶")
                plembed.react("⏏️").then(() =>{
                    const filter = (reaction, user) => (reaction.emoji.name === '🎶' || reaction.emoji.name === '⏏️') && user.id == message.author.id && player.queue.size>0;
                    const collectorR = plembed.createReactionCollector(filter, { max: 100, time: 30000 });
                    collectorR.on('collect', r => {
                        if (r.emoji.name === '🎶') {
                            plembed.delete();
                            message.react("🎶")
                            player.setQueueRepeat(false);
                        }
                        if (r.emoji.name === '⏏️') {
                            plembed.delete();
                            try{                   
                                player.queue.removeFrom(1, player.queue.size);
                                player.stop();
                            } catch{
                                player.stop();
                            }
                            message.react("⏏️");
                            player.setQueueRepeat(true);
                        }
                    });
                    collectorR.on("end", (_, reason) => {
                        if(["time"].includes(reason)) {
                            plembed.delete();
                            message.react("🎶")
                        }
                    });
                    }).catch(err => {
                        plembed.delete();
                        message.react("➕")
                        });
            }
        }
        if (!client.playlist.has(message.author.id+args.join(" "))) return message.reply("that playlist doesn't exist. Please check the name.").then(msg => msg.delete({timeout: 5000}));

        client.playlist.get(message.author.id+args.join(" ")).forEach(track => {
            client.music.search(track, message.author).then(async res => {
                switch (res.loadType) {
                    case "TRACK_LOADED":
                        player.queue.add(res.tracks[0]);
            }
        }).catch();
    });
    if (!player.playing) {
        player.play();
    }


    // function getMusic() {

    // }
    }
}

