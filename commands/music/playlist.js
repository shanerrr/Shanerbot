const {MessageEmbed} = require("discord.js");
const prettyMilliseconds = require('pretty-ms');
const User = require('../../models/user');
module.exports = { 
    config: {
        name: "playlist",
        description: "I will show all your current playlists.",
        usage: "ur playlist | ur playlist <playlist name>",
        category: "music",
        accessableby: "Members",
        aliases: ["pl"]
    },
    run: async (client, message, args) => {

        const foundUser = await User.findOne ({ userID: message.author.id });

        if (!args[0]) { //if no args are given will return all playlists
            if (!foundUser.playlists.length) {
                message.react("❌");
                return message.reply(`You currently don't have any playlists saved.`).then(msg => msg.delete({timeout: 5000}));
            }
            const asEmbed = new MessageEmbed()
            .setAuthor(`${message.author.username}: Playlist Manager`, message.author.displayAvatarURL())
            .setThumbnail(message.author.displayAvatarURL())
            .setColor("#B44874")
            .setDescription("Theses are your current playlists. You can view in your playlist in detail if you run the same command including your playlist name as an argument. \n(usage: ur playlist {playlist name})\n\u200b")
            .setTitle("__"+message.author.username+`**'s Playlists**__`)
            .setFooter(`ShanerBot: Playlists (${message.guild.name})`, client.user.displayAvatarURL());
            await foundUser.playlists.forEach(async function(sPlaylist, idx, array) {
                sPlaylist.songs.length ? asEmbed.addField("🎵 : "+sPlaylist.name+(sPlaylist.public ? "(🔓)" : "(🔒)"), sPlaylist.songs.length+" songs", true) : asEmbed.addField("🎵 : "+sPlaylist.name+(sPlaylist.public ? "(🔓)" : "(🔒)"),"Empty", true);
            })
            return message.channel.send({embed:asEmbed});

        } else{
            let objFound = false;
            await foundUser.playlists.forEach(async function(sPlaylist, idx, array) {
                if (sPlaylist.name === args.join(" ")){
                    objFound = true;
                    let index = 1;
                    let duration = 0;
                    const asEmbed = new MessageEmbed()
                        .setAuthor(`${message.author.username}: Playlist Manager`, message.author.displayAvatarURL())
                        .setColor("#B44874")
                        .setTitle("**PLAYLIST: "+"__"+sPlaylist.name.toUpperCase()+"__**")
                        .setFooter(`ShanerBot: Playlists (${message.guild.name})`, client.user.displayAvatarURL());
                        if(sPlaylist.songs.length){
                            asEmbed.setDescription(sPlaylist.songs.map(song => `**[${index++}] -** [${song.name}](${song.uri}) ~ **__[${prettyMilliseconds(parseInt(song.duration), {colonNotation: true, secondsDecimalDigits: 0})}]__**`));
                            sPlaylist.songs.forEach((track)=> {duration += parseInt(track.duration)});
                            asEmbed.addField('\u200b',`**__${sPlaylist.songs.length+"__ song(s)"} | __${prettyMilliseconds(duration, {colonNotation: true, secondsDecimalDigits: 0})}__ total length**`);
                        } else{
                            message.react("❌");
                            return message.reply(`That playlist is empty.`).then(msg => msg.delete({timeout: 5000}));
                        }
                    return message.channel.send({embed:asEmbed});   
                }
                if (idx === array.length - 1 && !objFound){ 
                    message.react("❌");
                    return message.reply(`That playlist doesn't exist, man....`).then(msg => msg.delete({timeout: 5000}));
                }        
            });
        }
    }
}