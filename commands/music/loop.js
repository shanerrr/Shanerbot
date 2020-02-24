const {RichEmbed} = require("discord.js")
const prettyMilliseconds = require('pretty-ms');

module.exports = { 
    config: {
        name: "loop",
        description: "i loop a playing song forever or stop a forever looping song.",
        usage: "ur loop",
        category: "music",
        accessableby: "Members",
        aliases: ["repeat"]
    },
    run: async (client, message, args) => {

        const player = client.music.players.get(message.guild.id);

        if (!player) return message.channel.send("`man ur know im not even connected to a channel, idot.`");
        if (!player.playing) return message.channel.send("`man ur know im not even playing a song.`");

        const { voiceChannel } = message.member;
        if(!voiceChannel || voiceChannel.id !== player.voiceChannel.id) return message.channel.send("`no song looping unless youre in the same channel as me`");

        const {title, requester, uri, duration} = player.queue[0];
        player.setTrackRepeat(!player.trackRepeat);
        if (player.trackRepeat) {
            const embed = new RichEmbed()
            .setAuthor(`${message.author.username}: Repeating a song`, message.author.displayAvatarURL)
            .setTitle("**"+title+"**")
            .setURL(uri)
            .setColor("#B44874")
            .setDescription(`**Now Repeating (${prettyMilliseconds(duration, {colonNotation: true, secondsDecimalDigits: 0})})**\nRequested by: ` + requester['username'])       
            .setFooter(`ShanerBot: Repeat (${message.guild.name})`, client.user.displayAvatarURL)
                message.channel.send(embed);
        } else{
            message.channel.send("`ok, i stopped repeating:`"+` **\`${title}\`**.`)
        }
    }
}