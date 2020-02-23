const {RichEmbed} = require("discord.js")
const prettyMilliseconds = require('pretty-ms');

module.exports = { 
  config: {
      name: "play",
      description: "i play music for u ok.",
      usage: "ur play",
      category: "music",
      accessableby: "Members",
      aliases: ["p", "search"]
  },
  run: async (client, message, args) => {

    const { voiceChannel } = message.member;
        if (!voiceChannel) return message.channel.send("`ur know i cant join if ur're not in channel, right?`");

        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has("CONNECT")) return message.channel.send("😢 "+"`mannnn, i don't have the permission to join that channel.`");
        if (!permissions.has("SPEAK")) return message.channel.send("🤐 "+ "`dude, i can't talk in there man.`");
        if (!args[0]) return message.channel.send("`play what song man? enter youtube url or search.`");
        if (voiceChannel.userLimit != 0 && voiceChannel.members.size >= voiceChannel.userLimit)
            if (permissions.has("CONNECT") && (permissions.has("MOVE_MEMBERS") || permissions.has("ADMINISTRATOR"))) {
            }else{
                return message.channel.send("😭" + " ``there is not enough room for me man, ttyl.``");
            } 

        const player = client.music.players.spawn({
          guild: message.guild,
          textChannel: message.channel,
          voiceChannel
      });

      client.music.search(args.join(" "), message.author).then(async res => {
        switch (res.loadType) {
            case "TRACK_LOADED":
                player.queue.add(res.tracks[0]);
                const aEmbed = new RichEmbed()
                    .setAuthor(`${message.author.username}: Enqueuing`, message.author.displayAvatarURL)
                    .setURL(res.tracks[0].uri)
                    .setThumbnail(res.tracks[0].thumbnail)
                    .setColor("#B44874")
                    .setTitle("**"+res.tracks[0].title+"**")
                    .addField("Duration:", `${prettyMilliseconds(res.tracks[0].duration, {colonNotation: true, secondsDecimalDigits: 0})}`, true)
                    .addField("Uploader:", `${res.tracks[0].author}`, true)
                    .setFooter(`ShanerBot: Play (${message.guild.name})`, client.user.displayAvatarURL)
                    if (player.queue.length > 1) aEmbed.addField("Position in queue:", `${player.queue.length-1}`, true)
                message.channel.send({embed:aEmbed});
                //message.channel.send(`Enqueuing \`${res.tracks[0].title}\` \`${Utils.formatTime(res.tracks[0].duration, true)}\``);
                if (!player.playing) player.play()
                break;
            
            case "SEARCH_RESULT":
                let index = 1;
                const tracks = res.tracks.slice(0, 10);
                const embed = new RichEmbed()
                    .setAuthor(`${message.author.name}: Enqueuing`, message.author.displayAvatarURL)
                    .setColor("#B44874")
                    .setDescription(tracks.map(video => `**${index++} -** ${video.title} **[${prettyMilliseconds(video.duration, {colonNotation: true, secondsDecimalDigits: 0})}]**`))
                    .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection", client.user.displayAvatarURL);
                query = await message.channel.send(embed);

                const collector = message.channel.createMessageCollector(m => {
                    return m.author.id === message.author.id && new RegExp(`^([1-9]|10|cancel)$`, "i").test(m.content)
                }, { time: 30000, max: 1});

                collector.on("collect", m => {
                    if (/cancel/i.test(m.content)) return collector.stop("cancelled")
                    const track = tracks[Number(m.content) - 1];
                    player.queue.add(track)
                    query.delete();
                    const asEmbed = new RichEmbed()
                        .setAuthor(`${message.author.username}: Enqueuing`, message.author.displayAvatarURL)
                        .setURL(track.uri)
                        .setThumbnail(track.thumbnail)
                        .setColor("#B44874")
                        .setTitle("**"+track.title+"**")
                        .addField("Duration:", `${prettyMilliseconds(track.duration, {colonNotation: true, secondsDecimalDigits: 0})}`, true)
                        .addField("Uploader:", `${track.author}`, true)
                        .setFooter(`ShanerBot: Play (${message.guild.name})`, client.user.displayAvatarURL)
                        if (player.queue.length > 1) asEmbed.addField("Position in queue:", `${player.queue.length-1}`, true)
                    message.channel.send({embed:asEmbed});
                    //message.channel.send(`Enqueuing \`${track.title}\` \`${Utils.formatTime(track.duration, true)}\``);
                    if(!player.playing) player.play();
                });

                collector.on("end", (_, reason) => {
                    if(["time", "cancelled", "leave"].includes(reason)) {
                        query.delete();
                        return message.channel.send("❌ "+"`ok cancelled.`")
                    } 
                });
                break;

            case "PLAYLIST_LOADED":
                res.playlist.tracks.forEach(track => player.queue.add(track));
                const duration = prettyMilliseconds(res.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, {colonNotation: true, secondsDecimalDigits: 0});
                message.channel.send(`Enqueuing \`${res.playlist.tracks.length}\` \`${duration}\` tracks in playlist \`${res.playlist.info.name}\``);
                if(!player.playing) player.play()
                break;
        }
    }).catch(err => message.channel.send(err.message))
}
}