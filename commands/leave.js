const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("leaves the current voice channel"),
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
        content: "I'm not even in a voice channel, dummy.",
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    await interaction.editReply({
      content: "Ill miss you, sweetie.",
    });

    return queue.destroy(true);
  },
};
