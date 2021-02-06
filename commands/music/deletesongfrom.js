const {MessageEmbed} = require("discord.js");
const prettyMilliseconds = require('pretty-ms');
const User = require('../../models/user');
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

        if (!args[0]) return message.reply(`That playlist doesnt exist.`).then(msg => msg.delete({timeout: 5000}));
        const foundUser = await User.findOne ({ userID: message.author.id });
        let objFound = false;
        let index = 1;
        let duration = 0;

        await foundUser.playlists.forEach(async function(sPlaylist, idx, array) {
            if (sPlaylist.name === args.join(" ")){
                objFound = true;
                const asEmbed = new MessageEmbed()
                    .setAuthor(`${message.author.username}: Playlist Manager`, message.author.displayAvatarURL())
                    .setColor("#B44874")
                    .setTitle("**"+"__"+sPlaylist.name.toUpperCase()+"__**"+(sPlaylist.public ? " (🔓)" : " (🔒)"))
                    .setFooter(`ShanerBot: Playlists (${message.guild.name})`, client.user.displayAvatarURL())
                    .setDescription(sPlaylist.songs.map(song => `**[${index++}] -** [${song.name}](${song.uri}) ~ **__[${prettyMilliseconds(parseInt(song.duration), {colonNotation: true, secondsDecimalDigits: 0})}]__**`));
                sPlaylist.songs.forEach((track)=> {duration += parseInt(track.duration)});
                if(sPlaylist.songs.length){
                    asEmbed.addField('\u200b',`**__${sPlaylist.songs.length+"__ song(s)"} | __${prettyMilliseconds(duration, {colonNotation: true, secondsDecimalDigits: 0})}__ total length**`);
                    asEmbed.addField(`**To delete only one song: **`,'usage: delete 1 => will delete only song 1.');
                    asEmbed.addField(`**To delete multiple songs: **`,'usage: delete [1,4] => will delete song 1 and 4 in the playlist.');
                    asEmbed.addField('\u200b', `To cancel deletion, react with ❌ or type cancel.`);
                }else{
                    message.react("❌");
                    return message.reply(`That playlist is empty, dumbo <3.`).then(msg => msg.delete({timeout: 5000}));
                }
                deletemsg = await message.channel.send({embed:asEmbed});
                deletemsg.react("❌").then(() =>{
                    const filter = (reaction, user) => (reaction.emoji.name === '❌') && user.id === message.author.id;
                    const collectorR = deletemsg.createReactionCollector(filter, { max: 1, time: 30000 });
                    collectorR.on('collect', r => {
                        if (r.emoji.name === '❌') {
                            message.react("❌");
                            collector.stop("time");
                            deletemsg.delete();
                        }
                    });
                })
                const collector = message.channel.createMessageCollector(m => {
                    //new RegExp(`^delete .*$`, "i").test(m.content) ||
                    //^delete (\d+(,\d+)*)?$
                    //new RegExp(`^([1-9]|1[0-5])$`, "i").test(m.content.split("delete ")[1]) || new RegExp(`^([a-zA-Z0-9]+,?\s*)+$`, "i").test(m.content.split("delete ")[1]) 
                    return m.author.id === message.author.id && (m.content.match(/[0-9]/g)|| m.content.toLowerCase().includes(`${prefix}dsf`) || m.content.toLowerCase().includes(`${prefix}dsfrom`) || m.content.toLowerCase().includes(`${prefix}deletesongfrom`) ||  m.content.toLowerCase().includes(`${prefix}${prefix}dsongfrom`))
                }, { time: 30000, max: 1});

                collector.on("collect", async m => {
                    // console.log(m.content)
                    if (/cancel/i.test(m.content)) {
                        deletemsg.delete();
                        m.react("✅");
                        return collector.stop("done") ;
                    }
                    if (m.content.toLowerCase().includes(`${prefix}deletesongfrom`)||m.content.toLowerCase().includes(`${prefix}dsongfrom`) || m.content.toLowerCase().includes(`${prefix}dsfrom`) || m.content.toLowerCase().includes(`${prefix}dsf`)) return collector.stop("time");
                    let res;
                    if (m.content.toLowerCase().includes("delete")){
                        res = m.content.toLowerCase().split("delete");
                        res = res[1].replace(/[\[\]']+/g,'').split(',');
                    }
                    await res.forEach(async function (num, idx, array) {
                        if(!Number.isInteger(Number(num))){
                            message.reply(`That is not a number!!!!!!!!!!!!!!!`).then(msg => msg.delete({timeout: 5000}));
                            return collector.stop("time");
                        }else{
                            if ((Number(num) <= sPlaylist.songs.length) && (Number(num) >= 1)){
                                await User.findOneAndUpdate({ userID:message.author.id, "playlists.name": sPlaylist.name}, {
                                    "$pull": {
                                        "playlists.$.songs": {
                                            _id: sPlaylist.songs[num-1],
                                            }
                                        }
                                    });
                                    deletemsg.delete();
                                    m.react("✅");
                            }else{
                                if (array.indexOf(num) == 0) {
                                    message.reply(`hmmmmm, that number doesnt make sense.....`).then(msg => msg.delete({timeout: 5000}));
                                    deletemsg.delete();
                                    message.react("❌");
                                }
                            }
                        } 
                    });
                    return collector.stop("done");
                });
                collector.on("end", (_, reason) => {
                    if(["time"].includes(reason)) {
                        plembed.delete();
                        return message.react("❌");
                    }
                });

            }
            if (idx === array.length - 1 && !objFound){ 
                message.react("❌");
                return message.reply(`You don't have a playlist named **__${args.join(" ")}__**  | usage: ur (deletesongfrom or dsf) {playlist}.`).then(msg => msg.delete({timeout: 5000}));
            }        
        });
    }
}