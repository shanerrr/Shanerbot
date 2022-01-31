const { embedAccent } = require("../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ordinal = require("ordinal");
const prettyMilliseconds = require("pretty-ms");

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
  async execute(client, interaction, player) {
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
    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
      },
      leaveOnEmptyCooldown: 600000,
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

    await interaction.deferReply();
    const track = await player
      .search(query, {
        requestedBy: interaction.user,
      })
      .then((x) => x.tracks[0]);
    if (!track)
      return await interaction.followUp({
        content: `❌ | Track **${query}** not found!`,
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

    const trackButtons = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("removeTrack")
        .setStyle("SECONDARY")
        .setEmoji("❌")
      // new MessageButton()
      //   .setCustomId("autoPlay")
      //   .setStyle("SECONDARY")
      //   .setEmoji("♾️")
    );

    // only show queue button of tracks in queue
    if (queue?.current) {
      trackButtons.addComponents(
        new MessageButton()
          .setCustomId("showQueue")
          .setStyle("SECONDARY")
          .setEmoji("🎶")
      );
    }

    // button collector
    const collector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id === track.requestedBy.id,
      time: 15000,
      max: 1,
      errors: ["time"],
    });

    collector.on("collect", async (i) => {
      //delete song button
      if (i.customId === "removeTrack") {
        trackEmbed.setDescription("**``Removed from Queue``**");
        if (queue.tracks.length) queue.remove(track.id);
        else queue.skip();
        await i.update({ embeds: [trackEmbed], components: [] });
        //show queue button
      } else if (i.customId === "showQueue")
        client.commands.get("queue").execute(client, interaction, player, i);
      //auto play button
      // else if (i.customId === "showQueue") {
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

    //adds or plays the track
    queue.play(track);

    return await interaction.followUp({
      embeds: [trackEmbed],
      components: [trackButtons],
    });
  },
};
