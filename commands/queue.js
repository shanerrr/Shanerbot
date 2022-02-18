const { embedAccent } = require("../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Returns the queue of songs"),

  async execute(client, interaction, prevInteraction = null) {
    // build and update our embed
    const embedBuilder = (hasSkipped = false, notEmpty = true) => {
      if (!notEmpty) {
        return new MessageEmbed()
          .setTitle("**" + "Queue is empty" + "**")
          .setDescription("Add more songs by using the play command!")
          .setColor(embedAccent);
      }

      const { title, requestedBy, url, thumbnail } = hasSkipped
        ? queue.tracks[0]
        : queue.current;
      const embed = new MessageEmbed()
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
          embed.addField(
            "**Currently in Queue**",
            "```" +
              queue.tracks.map((track, idx) => {
                if (hasSkipped && idx === 0) return;
                return `${idx ? "\n" : ""}[${idx + 1}] - ${track.title}`;
              }) +
              "```"
          );

      return embed;
    };

    //manage what interaction to deal with
    const mainInteraction = prevInteraction ? prevInteraction : interaction;

    //get queue
    const queue = client.player.getQueue(mainInteraction.guild);

    //is thinking command (not for chained interactions)
    !prevInteraction && (await mainInteraction.deferReply());

    // if no queue stop
    if (!queue && !prevInteraction) {
      return await mainInteraction.followUp({
        content: `Nothing in queue right now.`,
      });
    }

    // embed
    let queueEmbed = embedBuilder();

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
      filter: (i) => i.user.id === interaction.user.id,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      //delete song button
      if (i.customId === "pausePlay") {
        //update button and progress bar
        queueEmbed = embedBuilder();
        queue.setPaused(!queue.connection.paused);
        queueButtons.components[0].setEmoji(
          queue.connection.paused ? "▶️" : "⏸️"
        );
        await i.update({ embeds: [queueEmbed], components: [queueButtons] });
      } else if (i.customId === "skipSong") {
        const notEmpty = !!queue.tracks.length;
        queueEmbed = embedBuilder(true, notEmpty);
        queue.skip();
        await i.update({
          embeds: [queueEmbed],
          components: notEmpty ? [queueButtons] : [],
        });
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
