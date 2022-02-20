const { trackEmbedBuilder } = require("../builders/trackEmbed");
const { createQueue } = require("../helpers/createQueue");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song or adds to the current queue.")
    .addStringOption((option) =>
      option
        .setName("song")
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

    const query = interaction.options.get("song").value;
    const queue = await createQueue(client, interaction);

    const track = await client.player
      .search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      })
      .then((x) => x.tracks[0]);
    if (!track)
      return await interaction.reply({
        content: `❌ | Track **${query}** not found!`,
        ephemeral: true,
      });

    // defer reply
    await interaction.deferReply();

    const trackEmbed = trackEmbedBuilder(track, queue);
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
      await i.deferUpdate();

      //delete song button
      if (i.customId === `removeTrack_${track.id + queue?.tracks.length}`) {
        trackEmbed.setDescription("**``Removed from Queue``**");
        if (queue?.tracks.length) queue.remove(track.id);
        else queue.skip();
        await i.update({ embeds: [trackEmbed], components: [] });
        //show queue button
      } else if (i.customId === `showQueue${track.id + queue?.tracks.length}`)
        client.commands.get("queue").execute(client, interaction, true);
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
