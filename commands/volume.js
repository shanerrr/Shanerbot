const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("set music volume")
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription("The volume amount to set (0-100)")
        .setRequired(false)
    ),
  async execute(client, interaction) {
    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing)
      return await interaction.reply({
        content: "Hey, you ok? There is no song playing right now.",
        ephemeral: true,
      });

    const vol = parseInt(interaction.options.get("amount")?.value);

    if (!vol)
      return void interaction.reply({
        content: `🎧 | Current volume is **${queue.volume}**%!`,
        ephemeral: true,
      });
    if (vol < 0 || vol > 100)
      return void interaction.reply({
        content: "❌ | Volume range must be 0-100",
        ephemeral: true,
      });

    await interaction.deferReply();

    const success = queue.setVolume(vol);
    return void interaction.editReply({
      content: success
        ? `✅ | Volume set to **${vol}%**!`
        : "❌ | Something went wrong!",
    });
  },
};
