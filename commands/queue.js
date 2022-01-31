const { embedAccent } = require("../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Returns the queue of songs"),

  async execute(client, interaction, player, prevInteraction = null) {
    //get queue
    const queue = player.getQueue(interaction.guild);

    //is thinking command (not for chained interactions)
    !prevInteraction && (await interaction.deferReply());

    // if no queue stop
    if (!queue && !prevInteraction) {
      return await interaction.followUp({
        content: `Nothing in queue right now.`,
      });
    }

    const queueEmbed = new MessageEmbed()
      // .setAuthor({ name: "Now Playing", iconURL: queue.current.thumbnail })
      .setTitle("**" + queue.current.title + "**")
      .setDescription(
        `**${queue.createProgressBar({
          timecodes: true,
          queue: false,
          length: 35,
          line: "-",
          indicator: "🟣",
        })}**`
      )
      .setURL(queue.current.url)
      .setColor(embedAccent);
    queue.tracks.length &&
      queueEmbed.addField(
        "**Currently in Queue**",
        "```" +
          queue.tracks.map(
            (track, idx) => `${idx ? "\n" : ""}[${idx + 1}] - ${track.title}`
          ) +
          "```"
      );

    //checks if editing another interaction
    if (!prevInteraction) {
      return await interaction.followUp({
        embeds: [queueEmbed],
        // components: [trackButtons],
      });
    }

    // edits a previous interation
    return await prevInteraction.update({
      embeds: [queueEmbed],
      components: [],
    });
  },
};
