const { embedAccent } = require("../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");
const { QueryType } = require("discord-player");
const ordinal = require("ordinal");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("search for a song")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("A song name or url")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (!interaction.member.voice.channelId)
      return await interaction.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      });
    else if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    )
      return await interaction.reply({
        content: "You are not in my voice channel!",
        ephemeral: true,
      });

    const query = interaction.options.get("query").value;
    const queue = await client.player.createQueue(interaction.guild, {
      ytdlOptions: {
        filter: "audioonly",
        highWaterMark: 1 << 30,
        dlChunkSize: 0,
      },
      metadata: {
        interaction: interaction.channel,
      },
      leaveOnEmptyCooldown: 600000,
      leaveOnEnd: false,
      leaveOnStop: false,
      leaveOnEmpty: false,
    });

    // verify vc connection
    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();
      return await interaction.reply({
        content: "Could not join your voice channel!",
        ephemeral: true,
      });
    }

    const tracks = await client.player.search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!tracks.tracks.length)
      return await interaction.reply({
        content: `❌ | No results found for __${query}__`,
        ephemeral: true,
      });

    // defer reply
    await interaction.deferReply();

    const querySelect = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("querySelector")
        .setPlaceholder("Choose a song to add to the queue")
        .addOptions([
          {
            label: "Cancel",
            description: `Cancels song picking`,
            value: "cancel",
            emoji: {
              name: "❌",
            },
          },
          ...tracks.tracks.map((track, idx) => ({
            label: track.title,
            description: `${track.author} | ${track.duration}`,
            value: JSON.stringify({ index: idx }),
            emoji: {
              name: ["🎸", "🪕", "🪗", "🎺", "🎻", "🎷"][
                (6 * Math.random()) | 0
              ],
            },
          })),
        ])
    );

    // button collector
    const queryCollector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 30000,
      max: 1,
    });

    queryCollector.on("collect", async (i) => {
      return console.log(i);

      //delete song button
      if (i.customId === `cancel_${track.id + queue?.tracks.length}`) {
        trackEmbed.setDescription("**``Removed from Queue``**");
        if (queue?.tracks.length) queue.remove(track.id);
        else queue.skip();
        await i.update({ embeds: [trackEmbed], components: [] });
        //show queue button
      }
    });

    // // after time out, disable all buttons
    // collector.on("end", async (e, reason) => {
    //   if (reason === "time") {
    //     trackButtons.components[0]?.setDisabled(true);
    //     trackButtons.components[1]?.setDisabled(true);
    //     trackButtons.components[2]?.setDisabled(true);
    //     await interaction.editReply({
    //       embeds: [trackEmbed],
    //       components: [trackButtons],
    //     });
    //   }
    // });
    //end of button collector

    //END OF QUERY EMBED AND BUYTTON

    return await interaction.followUp({
      content: "Search Results for: " + "__**" + `${query}` + "**__",
      components: [querySelect],
    });

    const trackEmbed = new MessageEmbed()
      .setTitle("**" + track.title + "**")
      .setDescription(
        queue?.current
          ? "**``" +
              `${
                queue?.current && !queue.tracks.length
                  ? `Playing Next - (in ${prettyMilliseconds(
                      queue.current.durationMS - queue.streamTime,
                      { colonNotation: true, secondsDecimalDigits: 0 }
                    )}`
                  : `${ordinal(
                      queue.tracks.length + 1
                    )} In Queue - (in ${prettyMilliseconds(
                      queue.current.durationMS +
                        queue.totalTime -
                        queue.streamTime,
                      { colonNotation: true, secondsDecimalDigits: 0 }
                    )}`
              })` +
              "``**"
          : "**``Playing Now``**"
      )
      .setURL(track.url)
      .setThumbnail(track.thumbnail)
      .setColor(embedAccent)
      .addField("Uploader:", `${track.author}`, true)
      .addField("Duration:", track.duration, true)
      .setTimestamp();

    //adds or plays the track
    queue.addTrack(track);
    if (!queue.playing) await queue.play();

    const trackButtons = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`removeTrack_${track.id + queue?.tracks.length}`)
        .setStyle("DANGER")
        .setLabel("Remove")
    );

    // only show queue button of tracks in queue
    if (queue?.tracks.length) {
      trackButtons.addComponents(
        new MessageButton()
          .setCustomId(`showQueue${track.id + queue?.tracks.length}`)
          .setStyle("SECONDARY")
          .setLabel("Queue")
      );
    }

    // button collector
    const collector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id === track.requestedBy.id,
      time: 15000,
      max: 1,
    });

    collector.on("collect", async (i) => {
      //delete song button
      if (i.customId === `removeTrack_${track.id + queue?.tracks.length}`) {
        trackEmbed.setDescription("**``Removed from Queue``**");
        if (queue?.tracks.length) queue.remove(track.id);
        else queue.skip();
        await i.update({ embeds: [trackEmbed], components: [] });
        //show queue button
      } else if (i.customId === `showQueue${track.id + queue?.tracks.length}`)
        client.commands.get("queue").execute(client, interaction, i);
      //auto play button
      // else if (i.customId === `showQueue${track.id+queue?.tracks.length}`) {
      //   queue._handleAutoplay(track);
      // }
    });

    // after time out, disable all buttons
    collector.on("end", async (e, reason) => {
      if (reason === "time") {
        trackButtons.components[0]?.setDisabled(true);
        trackButtons.components[1]?.setDisabled(true);
        trackButtons.components[2]?.setDisabled(true);
        await interaction.editReply({
          embeds: [trackEmbed],
          components: [trackButtons],
        });
      }
    });
    //end of button collector

    return await interaction.followUp({
      embeds: [trackEmbed],
      components: [trackButtons],
    });
  },
};
