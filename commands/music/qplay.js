const { MessageEmbed } = require("discord.js")
const prettyMilliseconds = require('pretty-ms');
const { prefix } = require("../../botconfig.json")

module.exports = {
  config: {
    name: "qplay",
    description: "will play the first song found wihtout having to go through a search query. Make search query as accurate as possible for best results.",
    usage: "ur qplay <song name/url>",
    category: "music",
    accessableby: "Members",
    aliases: ["qp", "quickplay"]
  },
  run: async (client, message, args) => {

    const { channel } = message.member.voice;
    if (!channel) return message.channel.send("`ur know i cant join if youre not in a channel, right?`");
    if (!args[0]) return message.channel.send("`play what song man? enter youtube url or search.`");
    let commandfile = client.commands.get("join");
    if (commandfile) commandfile.run(client, message, []);

    let player = client.manager.players.get(message.guild.id);
    if (!player) {
      let commandfile = client.commands.get("join");
      if (commandfile) commandfile.run(client, message, []);
      player = client.manager.players.get(message.guild.id);
    }
    if (!player) return;
    client.manager.search(args.join(" "), message.author).then(async res => {
      switch (res.loadType) {
        case "TRACK_LOADED":
          if (res.tracks[0].duration > 10800000) return message.channel.send("`im not in the mood to listen to anything longer than 3 hours sorry nty.`");
          player.queue.add(res.tracks[0]);
          const aEmbed = new MessageEmbed()
            .setAuthor(`${message.author.username}: Enqueuing`, message.author.displayAvatarURL())
            .setURL(res.tracks[0].uri)
            .setThumbnail(res.tracks[0].thumbnail)
            .setColor("#B44874")
            .setTitle("**" + res.tracks[0].title + "**")
            .addField("Duration:", `${prettyMilliseconds(res.tracks[0].duration, { colonNotation: true, secondsDecimalDigits: 0 })}`, true)
            .addField("Uploader:", `${res.tracks[0].author}`, true)
            .setFooter(`ShanerBot: Play (${message.guild.name})`, client.user.displayAvatarURL())
          if (player.queue.size >= 1) {
            if (player.trackRepeat) {
              asEmbed.addField("Position in queue:", `${player.queue.size}`, true)
            } else {
              aEmbed.addField("Position in queue:", `${player.queue.size}: (${prettyMilliseconds(player.queue.duration - player.position - res.tracks[0].duration, { colonNotation: true, secondsDecimalDigits: 0 })} till played)`, true)
            }
          }
          message.channel.send({ embed: aEmbed });
          //message.channel.send(`Enqueuing \`${res.tracks[0].title}\` \`${Utils.formatTime(res.tracks[0].duration, true)}\``);
          if (!player.playing) player.play();
          break;

        case "SEARCH_RESULT":
          let testSearch = 0;
          while (true) {
            if (res.tracks[testSearch].duration > 10800000) {
              testSearch += 1;
              console.log(res.tracks.length)
              continue;
            }
            if (res.tracks.length === testSearch) return message.channel.send("`Couldn't find a youtube video that was under 3 hours, sorry bro..`");
            break
          }
          player.queue.add(res.tracks[testSearch]);
          const asEmbed = new MessageEmbed()
            .setAuthor(`${message.author.username}: Enqueuing`, message.author.displayAvatarURL())
            .setURL(res.tracks[testSearch].uri)
            .setThumbnail(`https://img.youtube.com/vi/${res.tracks[testSearch].identifier}/default.jpg`)
            .setColor("#B44874")
            .setTitle("**" + res.tracks[testSearch].title + "**")
            .addField("Duration:", `${prettyMilliseconds(res.tracks[testSearch].duration, { colonNotation: true, secondsDecimalDigits: 0 })}`, true)
            .addField("Uploader:", `${res.tracks[testSearch].author}`, true)
            .setFooter(`ShanerBot: Play (${message.guild.name})`, client.user.displayAvatarURL())
          if (player.queue.size >= 1) {
            if (player.trackRepeat) {
              asEmbed.addField("Position in queue:", `${player.queue.size}`, true)
            } else {
              asEmbed.addField("Position in queue:", `${player.queue.size}: (${prettyMilliseconds(player.queue.duration - player.position - res.tracks[testSearch].duration, { colonNotation: true, secondsDecimalDigits: 0 })} till played)`, true)
            }
          }
          message.channel.send({ embed: asEmbed });
          if (!player.playing) player.play();
          break;

        case "PLAYLIST_LOADED":
          return message.channel.send("`currently not supporting playlists. sorry man.`");
          break;
          res.playlist.tracks.forEach(track => player.queue.add(track));
          const duration = prettyMilliseconds(res.playlist.tracks.reduce((acc, cur) => ({ duration: acc.duration + cur.duration })).duration, { colonNotation: true, secondsDecimalDigits: 0 });
          message.channel.send(`Enqueuing \`${res.playlist.tracks.length}\` \`${duration}\` tracks in playlist \`${res.playlist.info.name}\``);
          if (!player.playing) player.play()

      }
    }).catch()//err => {if (err == "Error: No tracks were found." && client.retry.get(message.author.id) < 2) {client.retry.set(message.author.id, client.retry.get(message.author.id)+1); return getMusic();} else{return message.react("❌")}}) //message.react("❌"));//err => message.channel.send("`dude, try again maybe. Weird issue: "+`${err}`+"`"));
  }
}