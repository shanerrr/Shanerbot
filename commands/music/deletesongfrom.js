const {MessageEmbed} = require("discord.js");
const prettyMilliseconds = require('pretty-ms');
const {prefix} = require("../../botconfig.json")
module.exports = { 
    config: {
        name: "deletesongfrom",
        description: "i will delete a songs from a specified playlist.",
        usage: "ur deletesongfrom <playlist>",
        category: "music",
        accessableby: "Members",
        aliases: ["dsf","dsongfrom", "dsfrom"]
    },
    run: async (client, message, args) => {

        //doesnt support multiple deletes and right now if you enter a number or string it will disable the collector and make it useles

        if (args[0]) {
            var temp = client.playlistkeys.get(message.author.id);
            if (!temp.includes(args.join(" ").toLowerCase())) {
                message.react("❌");
                return message.reply(`That playlist doesnt exist.`).then(msg => msg.delete({timeout: 5000}));
            }
            var list;
            let index = 1;
            var duration = 0;
            try{
                list = JSON.parse(client.playlist.get(message.author.id+args.join(" ").toLowerCase()));
                if(!list) return message.reply(`That playlist is empty, dumbo <3.`).then(msg => msg.delete({timeout: 5000}));
                const asEmbed = new MessageEmbed()
                .setAuthor(`${message.author.username}: Playlist Manager`, message.author.displayAvatarURL())
                .setColor("#B44874")
                .setTitle("**Playlist: "+"__"+args.join(" ").toUpperCase()+"__**")
                .setFooter(`ShanerBot: Playlists (${message.guild.name})`, client.user.displayAvatarURL());
                if(list.length){
                    asEmbed.setDescription(list.map(video => `**[${index++}] -** [${video.title}](${video.uri}) ~ **__[${prettyMilliseconds(video.duration, {colonNotation: true, secondsDecimalDigits: 0})}]__**`));
                    list.forEach((track)=> {duration += track.duration});
                    asEmbed.addField(`**__${list.length+"__ song(s)"} | __${prettyMilliseconds(duration, {colonNotation: true, secondsDecimalDigits: 0})}__ total length**`, '----------------------------------------------------------------------------');
                } else{
                    asEmbed.setDescription(`**[1] -** [${list.title}](${list.uri}) ~ **__[${prettyMilliseconds(list.duration, {colonNotation: true, secondsDecimalDigits: 0})}]__**`);
                    asEmbed.addField(`**__1__ song(s) | __${prettyMilliseconds(list.duration, {colonNotation: true, secondsDecimalDigits: 0})}__ total length**`, '----------------------------------------------------------------------------');
                }
                // asEmbed.addField(`**To delete multiple songs: **`,'usage: (delete or d) 1,2,4 => will delete song 1, song 2, and song 4.');
                asEmbed.addField(`**To delete only one song: **`,'usage: (delete or d) 1 => will delete only song 1.');
                asEmbed.addField('\u200b', `To cancel deletion, react with ❌ or type cancel.`);
                deletemsg = await message.channel.send({embed:asEmbed}); 


                deletemsg.react("❌").then(() =>{
                const filter = (reaction, user) => (reaction.emoji.name === '❌') && user.id === message.author.id;
                const collectorR = deletemsg.createReactionCollector(filter, { max: 100, time: 30000 });
                collectorR.on('collect', r => {
                    if (r.emoji.name === '❌') {
                        message.react("❌");
                        collector.stop("time") 
                    }
                });
                }).catch(err => {
                    return collector.stop("time");
                });
                
                const collector = message.channel.createMessageCollector(m => {
                    return m.author.id === message.author.id && (new RegExp(`^d .*$`, "i").test(m.content) || new RegExp(`^delete .*$`, "i").test(m.content) || m.content.toLowerCase().includes(`${prefix}dsf`) || m.content.toLowerCase().includes(`${prefix}dsfrom`) || m.content.toLowerCase().includes(`${prefix}deletesongfrom`) ||  m.content.toLowerCase().includes(`${prefix}${prefix}dsongfrom`))
                }, { time: 30000, max: 1});


                collector.on("collect", m => {
                    if (/cancel/i.test(m.content)) {
                        return collector.stop("done") ;
                    }
                    if (m.content.toLowerCase().includes(`${prefix}deletesongfrom`)||m.content.toLowerCase().includes(`${prefix}dsongfrom`) || m.content.toLowerCase().includes(`${prefix}dsfrom`) || m.content.toLowerCase().includes(`${prefix}dsf`)) return collector.stop("twoSearch");
                    var res;
                    if (m.content.toLowerCase().includes("delete")){
                        res = m.toLowerCase().content.split("delete");
                    } else{
                        res = m.toLowerCase().content.split("d");
                    }
                    if(!Number.isInteger(Number(res[1]))){
                        m.react("❌");
                        message.reply(`That is not a number!!!!!!!!!!!!!!!`).then(msg => msg.delete({timeout: 5000}));
                        return collector.stop("time");
                    }else{
                        if ((Number(res[1]) <= (list.length | 1)) && Number(res[1]) >= 1){ 
                            try{
                                list.splice(res[1]-1, 1);
                                client.playlist.put(message.author.id+args.join(" ").toLowerCase(), JSON.stringify(list));
                                return collector.stop("done");                    
                            }catch{
                                if(Number(res[1] == 1)){
                                    client.playlist.put(message.author.id+args.join(" ").toLowerCase(), []);
                                    return collector.stop("done");
                                }
                            }
                        }else{
                            message.reply(`hmmmmm, that number doesnt make sense.....`).then(msg => msg.delete({timeout: 5000}));
                            return collector.stop("time");
                        }
                    }                    
                });

                collector.on("end", (_, reason) => {
                    if(["time", "leave", "twoSearch"].includes(reason)) {
                        deletemsg.delete();
                        return message.react("❌");
                    }
                    if(["done"].includes(reason)) {
                        deletemsg.delete();
                        return message.react("✅");
                    }
                    
                });









            }catch{
                message.react("❌");
                return message.reply(`That playlist is empty.`).then(msg => msg.delete({timeout: 5000}));
            }

        }else{
            message.react("❌");
            return message.reply("Please state a playlist name | `usage: ur (deletesongfrom or dsf) {playlist}`").then(msg => msg.delete({timeout: 15000}));
                                                                                                                                                                  
        }
    }
}