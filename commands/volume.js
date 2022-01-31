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
    await interaction.deferReply();

    const queue = client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: "❌ | No music is being played!",
      });
    const vol = parseInt(interaction.options.get("amount").value);

    if (!vol)
      return void interaction.followUp({
        content: `🎧 | Current volume is **${queue.volume}**%!`,
      });
    if (vol < 0 || vol > 100)
      return void interaction.followUp({
        content: "❌ | Volume range must be 0-100",
      });
    const success = queue.setVolume(vol);
    return void interaction.followUp({
      content: success
        ? `✅ | Volume set to **${vol}%**!`
        : "❌ | Something went wrong!",
    });
  },
};
