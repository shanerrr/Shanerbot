const {MessageEmbed} = require("discord.js")
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
      
    const { channel } = message.member.voice;
    if (!channel) return message.channel.send("`ur know i cant join if youre not in channel, right?`");
    if (!args[0]) return message.channel.send("`play what song man? enter youtube url or search.`");

    if (!client.music.players.get(message.guild.id)) {

        const permissions = channel.permissionsFor(client.user);
        if (!permissions.has("CONNECT")) return message.channel.send("😢 "+"`mannnn, i don't have the permission to join that channel.`");
        if (!permissions.has("SPEAK")) return message.channel.send("🤐 "+ "`dude, i can't talk in there man.`");
        if (channel.full){
            if (permissions.has("CONNECT") && (permissions.has("MOVE_MEMBERS") || permissions.has("ADMINISTRATOR"))) {
            }else{
                return message.channel.send("😭" + " ``there is not enough room for me man, ttyl.``");
            }
        }
        client.music.players.spawn({
            guild: message.guild,
            textChannel: message.channel,
            voiceChannel: channel
        });
    }
    else {
        if (client.music.players.get(message.guild.id) && (client.music.players.get(message.guild.id).voiceChannel.id != channel.id)) return message.channel.send("😍"+" `sorry man, seriosuly, but im already taken by a different voice channel.`");
    }
    const player = client.music.players.get(message.guild.id);

      client.music.search(args.join(" "), message.author).then(async res => {
        switch (res.loadType) {
            case "TRACK_LOADED":
                if (res.tracks[0].duration>10800000) return message.channel.send("`im not in the mood to listen to anything longer than 3 hours sorry nty.`");
                console.log(res.tracks);
                player.queue.add(res.tracks[0]);
                const aEmbed = new MessageEmbed()
                    .setAuthor(`${message.author.username}: Enqueuing`, message.author.displayAvatarURL)
                    .setURL(res.tracks[0].uri)
                    .setThumbnail(res.tracks[0].thumbnail)
                    .setColor("#B44874")
                    .setTitle("**"+res.tracks[0].title+"**")
                    .addField("Duration:", `${prettyMilliseconds(res.tracks[0].duration, {colonNotation: true, secondsDecimalDigits: 0})}`, true)
                    .addField("Uploader:", `${res.tracks[0].author}`, true)
                    .setFooter(`ShanerBot: Play (${message.guild.name})`, client.user.displayAvatarURL)
                    if (player.queue.length > 1) {
                        aEmbed.addField("Position in queue:", `${player.queue.length-1}: (${prettyMilliseconds(player.queue.duration-player.position-res.tracks[0].duration, {colonNotation: true, secondsDecimalDigits: 0})} till played)`, true)
                    }
                message.channel.send({embed:aEmbed});
                //message.channel.send(`Enqueuing \`${res.tracks[0].title}\` \`${Utils.formatTime(res.tracks[0].duration, true)}\``);
                if (!player.playing) player.play()
                break;
            
            case "SEARCH_RESULT":
                let index = 1;
                const tracks = res.tracks.slice(0, 10);
                const embed = new MessageEmbed()
                    .setAuthor(`${message.author.username}: Enqueuing`, message.author.displayAvatarURL)
                    .setColor("#B44874")
                    .setDescription(tracks.map(video => `**[${index++}] -** ${video.title} ~ **__[${prettyMilliseconds(video.duration, {colonNotation: true, secondsDecimalDigits: 0})}]__**`))
                    .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection", client.user.displayAvatarURL);
                query = await message.channel.send(embed);

                const collector = message.channel.createMessageCollector(m => {
                    return m.author.id === message.author.id && (new RegExp(`^([1-9]|10|cancel|ur leave)$`, "i").test(m.content) || m.content.includes("ur search") || m.content.includes("ur play"))
                }, { time: 30000, max: 1});

                collector.on("collect", m => {
                    if (/cancel/i.test(m.content)) return collector.stop("cancelled")
                    if (/ur leave/i.test(m.content)) return collector.stop("leave")
                    if (m.content.includes("ur search")||m.content.includes("ur play")) return collector.stop("twoSearch")

                    const track = tracks[Number(m.content) - 1];
                    if (track.duration>10800000) {
                        query.delete();
                        return message.channel.send("`im not in the mood to listen to anything longer than 3 hours sorry nty.`")
                    }
                    player.queue.add(track)
                    query.delete();
                    const asEmbed = new MessageEmbed()
                        .setAuthor(`${message.author.username}: Enqueuing`, message.author.displayAvatarURL)
                        .setURL(track.uri)
                        .setThumbnail(track.thumbnail)
                        .setColor("#B44874")
                        .setTitle("**"+track.title+"**")
                        .addField("Duration:", `${prettyMilliseconds(track.duration, {colonNotation: true, secondsDecimalDigits: 0})}`, true)
                        .addField("Uploader:", `${track.author}`, true)
                        .setFooter(`ShanerBot: Play (${message.guild.name})`, client.user.displayAvatarURL)
                        if (player.queue.length > 1) {
                            asEmbed.addField("Position in queue:", `${player.queue.length-1}: (${prettyMilliseconds(player.queue.duration-player.position-track.duration, {colonNotation: true, secondsDecimalDigits: 0})} till played)`, true)
                        }
                    message.channel.send({embed:asEmbed});
                    //message.channel.send(`Enqueuing \`${track.title}\` \`${Utils.formatTime(track.duration, true)}\``);
                    if(!player.playing) player.play();
                });

                collector.on("end", (_, reason) => {
                    if(["time", "cancelled"].includes(reason)) {
                        query.delete();
                        return message.channel.send("❌ "+"`ok cancelled.`")
                    }
                    if(["leave", "twoSearch"].includes(reason)) {
                        return query.delete();
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
    }).catch(err => message.channel.send("`dude, try again maybe. Weird issue: "+`${err}`+"`"));
  }
}