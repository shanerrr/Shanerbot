const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current playing song."),
  async execute(client, interaction) {
    if (!interaction.member.voice.channelId)
      return await interaction.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      });
    // if (
    //   interaction.guild.me.voice.channelId &&
    //   interaction.member.voice.channelId !==
    //     interaction.guild.me.voice.channelId
    // )
    //   return await interaction.reply({
    //     content: "You are not in my voice channel!",
    //     ephemeral: true,
    //   });

    //get queue
    const queue = await client.player.getQueue(interaction.guild);

    if (!queue) {
      return await interaction.reply({
        content: "Nothing playing right now to skip, Sweetie.",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    await interaction.editReply({
      content: `⏭️ | Skipped track **${queue.current.title}**!`,
    });

    return queue.skip();
  },
};
