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
            if (!temp) {
                return message.reply(`You currently don't have any playlists saved.`).then(msg => msg.delete({timeout: 5000}));
            }
            const asEmbed = new MessageEmbed()
            .setAuthor(`${message.author.username}: Playlist Manager`, message.author.displayAvatarURL())
            .setThumbnail(message.author.displayAvatarURL())
            .setColor("#B44874")
            .setDescription("Theses are your current playlists. You can view in your playlist in detail if you run the same command including your playlist name as an argument. \n(usage: ur playlist {playlist name}) ")
            .setTitle("__"+message.author.username+`**'s Playlists**__`)
            .setFooter(`ShanerBot: Playlists (${message.guild.name})`, client.user.displayAvatarURL());
            temp.forEach((name, index, array) => {
                var playlist = JSON.parse(client.playlist.get(message.author.id+name))
                asEmbed.addField("Playlist: "+name, playlist.length||"Empty"+" song(s)", true);
                duration += duration;
            })
            return message.channel.send({embed:asEmbed});
        } else{
            try{
                var list = JSON.parse(client.playlist.get(message.author.id+args.join(" ").toLowerCase()))
            } catch{
                return message.reply(`That playlist is empty.`).then(msg => msg.delete({timeout: 5000}));
            }
            let index = 1;
            if (!list) {
                return message.reply(`That playlist doesnt exist.`).then(msg => msg.delete({timeout: 5000}));
            }
            var duration = 0;
            const asEmbed = new MessageEmbed()
            .setAuthor(`${message.author.username}: Playlist Manager`, message.author.displayAvatarURL())
            .setColor("#B44874")
            .setTitle("**Playlist: "+"__"+args.join(" ").toUpperCase()+"__**")
            .setFooter(`ShanerBot: Playlists (${message.guild.name})`, client.user.displayAvatarURL());
            asEmbed.setDescription(list.map(video => `**[${index++}] -** [${video.title}](${video.uri}) ~ **__[${prettyMilliseconds(video.duration, {colonNotation: true, secondsDecimalDigits: 0})}]__**`))
            list.forEach((track)=> {duration += track.duration})
            asEmbed.addField('\u200b',`**__${list.length+"__ song(s)" || "Playlist is empty"} | __${prettyMilliseconds(duration, {colonNotation: true, secondsDecimalDigits: 0})}__ total length**`)
            return message.channel.send({embed:asEmbed});                                                                                                                                                           

        }
    }
}