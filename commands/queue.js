const { embedAccent } = require("../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Returns the queue of songs"),

  async execute(client, interaction, player, prevInteraction = null) {
    // build and update our embed
    const embedBuilder = (queue) => {
      return (
        new MessageEmbed()
          // .setAuthor({ name: "Now Playing", iconURL: queue.current.thumbnail })
          .setTitle("**" + queue.current.title + "**")
          .setDescription(
            `**${queue.createProgressBar({
              timecodes: true,
              queue: false,
              length: 25,
              line: "-",
              indicator: "🟣",
            })}**`
          )
          .setURL(queue.current.url)
          .setColor(embedAccent)
          .setThumbnail(queue.current.thumbnail)
      );
      queue.tracks.length &&
        queueEmbed.addField(
          "**Currently in Queue**",
          "```" +
            queue.tracks.map(
              (track, idx) => `${idx ? "\n" : ""}[${idx + 1}] - ${track.title}`
            ) +
            "```"
        );
    };

    //manage what interaction to deal with
    const mainInteraction = prevInteraction ? prevInteraction : interaction;

    //get queue
    const queue = player.getQueue(mainInteraction.guild);

    //is thinking command (not for chained interactions)
    !prevInteraction && (await mainInteraction.deferReply());

    // if no queue stop
    if (!queue && !prevInteraction) {
      return await mainInteraction.followUp({
        content: `Nothing in queue right now.`,
      });
    }

    // embed
    let queueEmbed = embedBuilder(queue);

    // buttons
    const queueButtons = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("pausePlay")
        .setStyle("SECONDARY")
        .setEmoji(queue.connection.paused ? "▶️" : "⏸️")
    );

    if (queue.tracks?.length) {
      queueButtons.addComponents(
        new MessageButton()
          .setCustomId("skipSong")
          .setStyle("SECONDARY")
          .setEmoji("⏭️")
      );
    }

    // button collector
    const collector = interaction.channel.createMessageComponentCollector({
      time: 60000,
    });

    collector.on("collect", async (i) => {
      //delete song button
      if (i.customId === "pausePlay") {
        //update button and progress bar
        queueEmbed = embedBuilder(queue);
        queue.setPaused(!queue.connection.paused);
        queueButtons.components[0].setEmoji(
          queue.connection.paused ? "▶️" : "⏸️"
        );
        await i.update({ embeds: [queueEmbed], components: [queueButtons] });
      } else if (i.customId === "skipSong") {
        queue.skip();
        queueEmbed = embedBuilder(queue);
        await i.update({ embeds: [queueEmbed], components: [queueButtons] });
      }
    });

    // after time out, disable all buttons
    collector.on("end", async (e, reason) => {
      if (reason === "time") {
        queueButtons.components[0]?.setDisabled(true);
        queueButtons.components[1]?.setDisabled(true);
        await mainInteraction.editReply({
          embeds: [queueEmbed],
          components: [queueButtons],
        });
      }
    });
    //end of button collector

    // edits a previous interation
    if (prevInteraction) {
      return await mainInteraction.update({
        embeds: [queueEmbed],
        components: [queueButtons],
      });
    }

    //checks if editing another interaction
    return await mainInteraction.followUp({
      embeds: [queueEmbed],
      components: [queueButtons],
    });
  },
};
