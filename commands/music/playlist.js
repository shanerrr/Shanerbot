const {MessageEmbed} = require("discord.js");
const prettyMilliseconds = require('pretty-ms');
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
        if (!args[0]) {
            var temp = client.playlistkeys.get(message.author.id)
            if (!temp || temp.length == 0) {
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
            temp.forEach((name) => {
                var playlist;
                try{
                    playlist = JSON.parse(client.playlist.get(message.author.id+name))
                    if (playlist.length){
                        asEmbed.addField("🎵 : "+name.toUpperCase(), playlist.length+" songs", true);
                    }else{
                        asEmbed.addField("🎵 : "+name.toUpperCase(), 1 +" song", true);
                    }
                } catch{
                    asEmbed.addField("🎵 : "+name.toUpperCase(),"Empty", true);
                }
            })
            return message.channel.send({embed:asEmbed});
        } else{
            if (!client.playlistkeys.get(message.author.id).includes(args.join(" ").toLowerCase())) {
                message.react("❌");
                return message.reply(`That playlist doesnt exist.`).then(msg => msg.delete({timeout: 5000}));
            }
            var list;
            let index = 1;
            var duration = 0;
            try{
                list = JSON.parse(client.playlist.get(message.author.id+args.join(" ").toLowerCase()))
                const asEmbed = new MessageEmbed()
                .setAuthor(`${message.author.username}: Playlist Manager`, message.author.displayAvatarURL())
                .setColor("#B44874")
                .setTitle("**Playlist: "+"__"+args.join(" ").toUpperCase()+"__**")
                .setFooter(`ShanerBot: Playlists (${message.guild.name})`, client.user.displayAvatarURL());
                if(list.length){
                    asEmbed.setDescription(list.map(video => `**[${index++}] -** [${video.title}](${video.uri}) ~ **__[${prettyMilliseconds(video.duration, {colonNotation: true, secondsDecimalDigits: 0})}]__**`));
                    list.forEach((track)=> {duration += track.duration});
                    asEmbed.addField('\u200b',`**__${list.length+"__ song(s)"} | __${prettyMilliseconds(duration, {colonNotation: true, secondsDecimalDigits: 0})}__ total length**`);
                } else{
                    asEmbed.setDescription(`**[1] -** [${list.title}](${list.uri}) ~ **__[${prettyMilliseconds(list.duration, {colonNotation: true, secondsDecimalDigits: 0})}]__**`);
                    asEmbed.addField('\u200b',`**__1__ song" | __${prettyMilliseconds(list.duration, {colonNotation: true, secondsDecimalDigits: 0})}__ total length**`);
                }
                return message.channel.send({embed:asEmbed});    
            } catch{
                message.react("❌");
                return message.reply(`That playlist is empty.`).then(msg => msg.delete({timeout: 5000}));
            }                                                                                                                                                      
        }
    }
}