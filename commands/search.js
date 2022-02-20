const { embedAccent } = require("../config.json");
const { trackEmbedBuilder } = require("../builders/trackEmbed");
const { createQueue } = require("../helpers/createQueue");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");
// const wait = require("util").promisify(setTimeout);

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
    const queue = await createQueue(client, interaction);

    const tracks = await client.player.search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!tracks.tracks.length)
      return await interaction.reply({
        content: `❌ | No results found for __${query}__`,
        ephemeral: true,
      });

    // defering to get more time (is thinking effect)
    await interaction.deferReply();

    const querySelect = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("querySelector")
        .setPlaceholder("Choose a song to add to the queue")
        .addOptions([
          {
            label: "Cancel",
            description: `Cancels the current song picking for ${query}`,
            value: `cancel_${interaction.id}`,
            emoji: {
              name: "❌",
            },
          },
          ...tracks.tracks.map((track, idx) => ({
            label: track.title,
            description: `${track.author} | ${track.duration}`,
            value: JSON.stringify({ index: idx }),
            emoji: {
              name: "🎶",
            },
          })),
        ])
    );

    // query select menu collector
    const queryCollector = interaction.channel.createMessageComponentCollector({
      componentType: "SELECT_MENU",
      filter: (i) => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      },
      time: 30000,
      max: 1,
    });

    queryCollector.on("collect", async (i) => {
      if (i.values[0] === `cancel_${interaction.id}`) {
        // fix issue timeout
        await interaction.deleteReply();
      } else {
        // append track object to interaction for use later on
        interaction.aTrack = tracks.tracks[JSON.parse(i.values[0]).index];

        //adds the track
        await queue.addTrack(interaction.aTrack);
        if (!queue.playing) await queue.play();

        //reply new embed
        await interaction.editReply({
          embeds: [trackEmbedBuilder(interaction.aTrack, queue)],
          components: [trackButtons],
        });
      }
    });

    // after time out, delete embed
    queryCollector.on("end", async (e, reason) => {
      // fix issue timeout
      if (reason === "time") await interaction.deleteReply();
    });
    //end of query select menu collector

    const trackButtons = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`removeTrack_${interaction.id}`)
        .setStyle("DANGER")
        .setLabel(queue.current ? "Remove" : "Skip")
    );

    // only show queue button of tracks in queue
    if (queue?.current) {
      trackButtons.addComponents(
        new MessageButton()
          .setCustomId(`showQueue_${interaction.id}`)
          .setStyle("PRIMARY")
          .setLabel("Queue")
      );
    }

    //for the button response after select menu
    const buttonCollector = interaction.channel.createMessageComponentCollector(
      {
        componentType: "BUTTON",
        filter: (i) => i.user.id === interaction.user.id,
        time: 15000,
        max: 1,
      }
    );

    buttonCollector.on("collect", async (i) => {
      if (i.customId === `removeTrack_${interaction.id}`) {
        const trackEmbed = trackEmbedBuilder(interaction.aTrack, queue);

        if (queue.current.id === interaction.aTrack.id) {
          queue.skip();
          trackEmbed.setDescription("**``Skipped``**");
        } else {
          queue.remove(interaction.aTrack.id);
          trackEmbed.setDescription("**``Removed from Queue``**");
        }

        await interaction.editReply({ embeds: [trackEmbed], components: [] });
        // //show queue button
      } else if (i.customId === `showQueue_${interaction.id}`) {
        i.deferUpdate();
        client.commands.get("queue").execute(client, interaction, true);
      }
    });

    // after time out, disable all buttons
    buttonCollector.on("end", async (e, reason) => {
      if (reason === "time") {
        trackButtons.components[0]?.setDisabled(true);
        trackButtons.components[1]?.setDisabled(true);
        await interaction.editReply({
          components: [trackButtons],
        });
      }
    });

    return await interaction.editReply({
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
  },
};
