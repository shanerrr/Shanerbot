const { embedAccent } = require("../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Returns the queue of songs"),

  async execute(client, interaction, isChainedResponse = false) {
    // build and update our embed
    const embedBuilder = (hasSkipped = false, notEmpty = true) => {
      if (!notEmpty) {
        return new EmbedBuilder()
          .setTitle("**" + "Queue is empty" + "**")
          .setDescription("Add more songs by using the play command!")
          .setColor(embedAccent);
      }

      const { title, requestedBy, url, thumbnail } = hasSkipped
        ? queue.tracks[0]
        : queue?.current;
      const embed = new EmbedBuilder()
        .setTitle("**" + title + "**")
        .setDescription(
          hasSkipped
            ? "**`Just Started Playing`**\n" +
                `Requested by: <@${requestedBy.id}>`
            : `**${queue.createProgressBar({
                timecodes: true,
                queue: false,
                length: 25,
                line: "-",
                indicator: "🟣",
              })}** \n Requested by: <@${requestedBy.id}>`
        )
        .setURL(url)
        .setColor(embedAccent)
        .setThumbnail(thumbnail);
      hasSkipped
        ? queue.tracks.length - 1
        : queue.tracks.length &&
          embed.addFields({
            name: "**Currently in Queue**",
            value:
              "```" +
              queue.tracks.map((track, idx) => {
                if (hasSkipped && idx === 0) return;
                return `${idx ? "\n" : ""}[${idx + 1}] - ${track.title}`;
              }) +
              "```",
          });

      return embed;
    };

    //get queue
    const queue = client.player.getQueue(interaction.guild);

    // if no queue stop
    if (!queue?.current) {
      return await interaction.reply({
        content: `Bucko, nothing in queue right now. Maybe add a song?`,
        ephemeral: true,
      });
    }

    // defering to get more time (is thinking effect) only when not chained command
    !isChainedResponse && (await interaction.deferReply());

    // embed
    let queueEmbed = embedBuilder();

    // // buttons
    // const queueButtons = new MessageActionRow().addComponents(
    //   new MessageButton()
    //     .setCustomId(`pausePlay_${interaction.id}`)
    //     .setStyle("SECONDARY")
    //     .setEmoji(queue.connection.paused ? "▶️" : "⏸️"),
    //   new MessageButton()
    //     .setCustomId(`skipSong_${interaction.id}`)
    //     .setStyle("SECONDARY")
    //     .setEmoji("⏭️")
    // );

    // // button collector
    // const collector = interaction.channel.createMessageComponentCollector({
    //   filter: (i) => {
    //     i.deferUpdate();
    //     return i.user.id === interaction.user.id;
    //   },
    //   time: 60000,
    // });

    // collector.on("collect", async (i) => {
    //   //delete song button
    //   if (i.customId === `pausePlay_${interaction.id}`) {
    //     //update button and progress bar
    //     queueEmbed = embedBuilder();
    //     queue.setPaused(!queue.connection.paused);
    //     queueButtons.components[0].setEmoji(
    //       queue.connection.paused ? "▶️" : "⏸️"
    //     );
    //     await interaction.editReply({
    //       embeds: [queueEmbed],
    //       components: [queueButtons],
    //     });
    //   } else if (i.customId === `skipSong_${interaction.id}`) {
    //     const notEmpty = !!queue.tracks.length;
    //     queueEmbed = embedBuilder(true, notEmpty);
    //     queue.skip();
    //     await interaction.editReply({
    //       embeds: [queueEmbed],
    //       components: notEmpty ? [queueButtons] : [],
    //     });
    //   }
    // });

    // // after time out, disable all buttons
    // collector.on("end", async (e, reason) => {
    //   if (reason === "time") {
    //     queueButtons.components[0]?.setDisabled(true);
    //     queueButtons.components[1]?.setDisabled(true);
    //     await interaction.editReply({
    //       embeds: [queueEmbed],
    //       components: [queueButtons],
    //     });
    //   }
    // });
    // //end of button collector

    //checks if editing another interaction
    return await interaction.editReply({
      embeds: [queueEmbed],
      // components: [queueButtons],
    });
  },
};
