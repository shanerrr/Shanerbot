const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filters")
    .setDescription("changes the audio filter"),
  async execute(client, interaction) {
    if (!interaction.member.voice.channelId)
      return await interaction.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      });
    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    )
      return await interaction.reply({
        content: "You are not in my voice channel!",
        ephemeral: true,
      });

    //get queue
    const queue = await client.player.getQueue(interaction.guild);

    if (!queue) {
      return await interaction.reply({
        content: "I'm not even in a voice channel, dummy.",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const filterSelect = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("querySelector")
        .setPlaceholder("Choose an audio filter")
        .addOptions([
          {
            label: "Cancel",
            description: `Cancels the picker`,
            value: `cancel_${interaction.id}`,
            emoji: {
              name: "❌",
            },
          },
          {
            label: "Normalizer",
            description: `The normalizer filter (dynamic audio normalizer based)`,
            value: "normalizer",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "8D",
            description: `The 8D filter`,
            value: "8D",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Nightcore",
            description: `The nightcore filter`,
            value: "nightcore",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Phaser",
            description: `The phaser filter`,
            value: "phaser",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Tremolo",
            description: `The tremolo filter`,
            value: "tremolo",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Vibrato",
            description: `The vibrato filter`,
            value: "vibrato",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Reverse",
            description: `The reverse filter`,
            value: "reverse",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Treble",
            description: `The treble filter`,
            value: "treble",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Distorted",
            description: `The distorted filter`,
            value: "earrape",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Bassboost",
            description: `The bassboost filter (+20dB)`,
            value: "bassboost",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "High bassboost",
            description: `The bassboost filter (+30dB)`,
            value: "bassboost_high",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Pulsator",
            description: `The pulsator filter`,
            value: "pulsator",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Karaoke",
            description: `The karaoke filter`,
            value: "karaoke",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Flanger",
            description: `The flanger filter`,
            value: "flanger",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Haas",
            description: `The haas filter`,
            value: "haas",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Mstlr",
            description: `The mstlr filter`,
            value: "mstlr",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Mstrr",
            description: `The mstrr filter`,
            value: "mstrr",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Compressor",
            description: `The compressor filter`,
            value: "compressor",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Expander",
            description: `The expander filter`,
            value: "expander",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Chorus",
            description: `The chorus filter`,
            value: "chorus",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Chorus2d",
            description: `The chorus2d filter`,
            value: "chorus2d",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Chorus3d",
            description: `The chorus3d filter`,
            value: "chorus3d",
            emoji: {
              name: "🎛️",
            },
          },
          {
            label: "Fadein",
            description: `The fadein filter`,
            value: "fadein",
            emoji: {
              name: "🎛️",
            },
          },
        ])
    );

    // query select menu collector
    const filterCollector = interaction.channel.createMessageComponentCollector(
      {
        componentType: "SELECT_MENU",
        filter: (i) => {
          i.deferUpdate();
          return i.user.id === interaction.user.id;
        },
        time: 60000,
      }
    );

    filterCollector.on("collect", async (i) => {
      if (i.values[0] === `cancel_${interaction.id}`) {
        // fix issue timeout
        await interaction.deleteReply();
      } else {
        return await queue.setFilters({
          [i.values[0]]: !queue.getFiltersEnabled().includes(i.values[0]),
          normalizer2: !queue.getFiltersEnabled().includes(i.values[0]), // because we need to toggle it with bass
        });
      }
    });

    // after time out, delete embed
    filterCollector.on("end", async (e, reason) => {
      // fix issue timeout
      if (reason === "time") await interaction.deleteReply();
    });
    //end of query select menu collector

    return await interaction.editReply({
      content: "Choose an audio filter from the dropdown below",
      components: [filterSelect],
    });
  },
};
