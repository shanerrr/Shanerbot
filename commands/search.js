const { embedAccent } = require("../config.json");
const { trackEmbedBuilder } = require("../builders/trackEmbed");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");

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
    // await interaction.deferReply();

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
      if (i.values[0] === "cancel") await interaction.deleteReply();
      else {
        let index = JSON.parse(i.values[0]).index;
        //adds or plays the track then updates interaction
        await interaction.editReply({
          embeds: [trackEmbedBuilder(tracks.tracks[index], queue)],
          components: [],
        });
        queue.addTrack(tracks.tracks[index]);
        if (!queue.playing) await queue.play();
      }

      //delete song button
      // if (i.customId === `cancel_${track.id + queue?.tracks.length}`) {
      // if (queue?.tracks.length) queue.remove(track.id);
      // else queue.skip();
      // await i.update({ embeds: [trackEmbed], components: [] });
      //show queue button
      // }
    });

    // after time out, delete embed
    queryCollector.on("end", async (e, reason) => {
      if (reason === "time") await interaction.deleteReply();
    });
    //end of button collector

    //END OF QUERY EMBED AND BUYTTON

    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(
            `${tracks.tracks.length} results found for: __**${query}**__`
          )
          .setDescription(
            "**You have 30 seconds to choose a song from the dropdown below.**"
          )
          .setColor(embedAccent),
      ],
      components: [querySelect],
    });

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
