const {MessageEmbed} = require("discord.js")
const solenolyrics = require("solenolyrics"); 
module.exports = { 
    config: {
        name: "lyrics",
        description: "Ill get you the lyrics of a song or current song playing.",
        usage: "ur l or ur l <song author song name>",
        category: "music",
        accessableby: "Members",
        aliases: ["l", "lyrics"]
    },
    run: async (client, message, args) => {

        var lyrics, author, song, icon;
        if(!args[0]) {
            const player = client.music.players.get(message.guild.id);
            if (!player) {
                return message.channel.send("`Please either enter a song name, or have the bot be playing a song to use this command.`").then(msg => msg.delete({timeout:10000}));
            }
            var msglyrics = await message.channel.send("``Looking for Lyrics for current playing song...``")
            var check = await getInfo(player.queue[0].title, message, msglyrics)
            if (check == 0) return;
        }
        else {
            var msglyrics = await message.channel.send("Looking for Lyrics for "+ "`"+`${args.join(" ")}`+"`")
            var check = await getInfo(args.join(" "), message, msglyrics)
            if (check == 0) return;

        }
        if (lyrics.length > 2048) var chunks = lyrics.match(/(.|[\r\n]){1,2048}(\s|$)/g);
        else {
            const asEmbed = new MessageEmbed()
            .setTitle(`**${author} - ${song}**`)
            .setThumbnail(icon)
            .setDescription(lyrics)
            .setColor("#B44874")
            .setFooter(`ShanerBot: Lyrics (${message.guild.name})`, client.user.displayAvatarURL())
            msglyrics.delete();
            return message.channel.send({embed:asEmbed});
        }
        msglyrics.delete();
        chunks.forEach(function (i,x) {
            const asEmbed = new MessageEmbed()
            .setColor("#B44874")
            if(!x) {
                asEmbed.setTitle(`**${author} - ${song}**`)
                asEmbed.setThumbnail(icon)
            }
            if(x == chunks.length-1) asEmbed.setFooter(`ShanerBot: Lyrics (${message.guild.name})`, client.user.displayAvatarURL())
            asEmbed.setDescription(chunks[x]) 
            return message.channel.send({embed:asEmbed});
        });
    async function getInfo(infoI, messageI, delI) {
        lyrics = await solenolyrics.requestLyricsFor(infoI);
        if (lyrics == undefined) {
            messageI.react("❌");
            delI.delete();
            return 0;
        }
        lyrics += `\n\n[Lyrics Requested by: <@${message.author.id}>]`;
        author = await solenolyrics.requestAuthorFor(infoI);
        song = await solenolyrics.requestTitleFor(infoI);
        icon = await solenolyrics.requestIconFor(infoI);
    }
    }
}