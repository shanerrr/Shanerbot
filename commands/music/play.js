const {MessageEmbed} = require("discord.js")
const prettyMilliseconds = require('pretty-ms');
const {prefix} = require("../../botconfig.json")

module.exports = { 
  config: {
      name: "play",
      description: "i play music for u ok.",
      usage: "ur play <song name/url>",
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
            voiceChannel: channel,
            selfDeaf: true
        });
    }
    else {
        if (client.music.players.get(message.guild.id) && (client.music.players.get(message.guild.id).voiceChannel.id != channel.id)) return message.channel.send("😍"+" `sorry man, seriosuly, but im already taken by a different voice channel.`");
    }
    const player = client.music.players.get(message.guild.id);
    client.retry.set(message.author.id, 0);
    getMusic();


function getMusic() {
    client.music.search(args.join(" "), message.author).then(async res => {
        switch (res.loadType) {
            case "TRACK_LOADED":
                if (res.tracks[0].duration>10800000) return message.channel.send("`im not in the mood to listen to anything longer than 3 hours sorry nty.`");
                player.queue.add(res.tracks[0]);
                const aEmbed = new MessageEmbed()
                    .setAuthor(`${message.author.username}: Enqueuing`, message.author.displayAvatarURL())
                    .setURL(res.tracks[0].uri)
                    .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/default.jpg`)
                    .setColor("#B44874")
                    .setTitle("**"+res.tracks[0].title+"**")
                    .addField("Duration:", `${prettyMilliseconds(res.tracks[0].duration, {colonNotation: true, secondsDecimalDigits: 0})}`, true)
                    .addField("Uploader:", `${res.tracks[0].author}`, true)
                    .setFooter(`ShanerBot: Play (${message.guild.name})`, client.user.displayAvatarURL())
                    if (player.queue.length > 1) {
                        if (player.trackRepeat) {
                            asEmbed.addField("Position in queue:", `${player.queue.length-1}`, true)
                        }else{
                            aEmbed.addField("Position in queue:", `${player.queue.length-1}: (${prettyMilliseconds(player.queue.duration-player.position-res.tracks[0].duration, {colonNotation: true, secondsDecimalDigits: 0})} till played)`, true)
                        }
                    }
                message.channel.send({embed:aEmbed});
                //message.channel.send(`Enqueuing \`${res.tracks[0].title}\` \`${Utils.formatTime(res.tracks[0].duration, true)}\``);
                if (!player.playing) player.play()
                break;
            
            case "SEARCH_RESULT":
                let index = 1;
                const tracks = res.tracks.slice(0, 10);
                const embedf = new MessageEmbed()
                    .setAuthor(`${message.author.username}: Song Picker`, message.author.displayAvatarURL())
                    .setColor("#B44874")
                    .setDescription(tracks.map(video => `**[${index++}] -** ${video.title} ~ **__[${prettyMilliseconds(video.duration, {colonNotation: true, secondsDecimalDigits: 0})}]__**`))
                    .setFooter("Your have 30 seconds to pick a song. Type 'cancel' to cancel the selection", client.user.displayAvatarURL());
                query = await message.channel.send(embedf)

                query.react("⬅️")
                query.react("➡️").then(() =>{
                const filter = (reaction, user) => (reaction.emoji.name === '➡️' || reaction.emoji.name === '⬅️') && user.id === message.author.id;
                const collectorR = query.createReactionCollector(filter, { max: 100, time: 30000 });
                collectorR.on('collect', r => {
                    if (r.emoji.name === '➡️') {
                        const tracks = res.tracks.slice(10, 20);
                        let index = 11;
                        const embed = new MessageEmbed()
                            .setAuthor(`${message.author.username}: Enqueuing`, message.author.displayAvatarURL())
                            .setColor("#B44874")
                            .setDescription(tracks.map(video => `**[${index++}] -** ${video.title} ~ **__[${prettyMilliseconds(video.duration, {colonNotation: true, secondsDecimalDigits: 0})}]__**`))
                            .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection", client.user.displayAvatarURL());
                        query.edit(embed);
                    }
                    else query.edit(embedf);
                });
                }).catch(err => err);
                
                const collector = message.channel.createMessageCollector(m => {
                    return m.author.id === message.author.id && (new RegExp(`^([1-9]|1[0-9]|20|cancel|${prefix}leave)$`, "i").test(m.content) || m.content.includes(`${prefix}search`) || m.content.includes(`${prefix}play`))
                }, { time: 30000, max: 1});

                collector.on("collect", m => {
                    if (/cancel/i.test(m.content)) {
                        m.react("✅");
                        return collector.stop("cancelled") 
                    }
                    if (/ur leave/i.test(m.content)) return collector.stop("leave")
                    if (m.content.includes("ur search")||m.content.includes("ur play")) return collector.stop("twoSearch")
                    const tracks = res.tracks.slice(0, 20);
                    const track = tracks[Number(m.content) - 1];
                    if (track.duration>10800000) {
                        query.delete();
                        return message.channel.send("`im not in the mood to listen to anything longer than 3 hours sorry nty.`")
                    }
                    player.queue.add(track)
                    query.delete();
                    const asEmbed = new MessageEmbed()
                        .setAuthor(`${message.author.username}: Enqueuing`, message.author.displayAvatarURL())
                        .setURL(track.uri)
                        .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/default.jpg`)
                        .setColor("#B44874")
                        .setTitle("**"+track.title+"**")
                        .addField("Duration:", `${prettyMilliseconds(track.duration, {colonNotation: true, secondsDecimalDigits: 0})}`, true)
                        .addField("Uploader:", `${track.author}`, true)
                        .setFooter(`ShanerBot: Play (${message.guild.name})`, client.user.displayAvatarURL())
                        if (player.queue.length > 1) {
                            if (player.trackRepeat) {
                                asEmbed.addField("Position in queue:", `${player.queue.length-1}`, true)
                            }else{
                                asEmbed.addField("Position in queue:", `${player.queue.length-1}: (${prettyMilliseconds(player.queue.duration-player.position-track.duration, {colonNotation: true, secondsDecimalDigits: 0})} till played)`, true)
                            }
                        }
                    message.channel.send({embed:asEmbed});
                    //message.channel.send(`Enqueuing \`${track.title}\` \`${Utils.formatTime(track.duration, true)}\``);
                    if(!player.playing) player.play();
                });

                collector.on("end", (_, reason) => {
                    if(["time", "leave", "twoSearch"].includes(reason)) {
                        query.delete();
                        return message.react("❌");
                    }
                    if(["cancelled"].includes(reason)) {
                        query.delete();
                    }
                });
                break;

            case "PLAYLIST_LOADED":
                return message.channel.send("`currently not supporting playlists. sorry man.`")
                res.playlist.tracks.forEach(track => player.queue.add(track));
                const duration = prettyMilliseconds(res.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, {colonNotation: true, secondsDecimalDigits: 0});
                message.channel.send(`Enqueuing \`${res.playlist.tracks.length}\` \`${duration}\` tracks in playlist \`${res.playlist.info.name}\``);
                if(!player.playing) player.play()
                break;

        }       
    }).catch(err => {if (err == "Error: No tracks were found." && client.retry.get(message.author.id) < 2) {client.retry.set(message.author.id, client.retry.get(message.author.id)+1); return getMusic();} else{return message.react("❌")}}) //message.react("❌"));//err => message.channel.send("`dude, try again maybe. Weird issue: "+`${err}`+"`"));
}
  }
}