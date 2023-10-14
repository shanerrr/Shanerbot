const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current playing song."),
  async execute(_, interaction) {
    const channel = interaction.member.voice.channel;

    if (!channel)
      return await interaction.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      });

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();

    const player = useMainPlayer();

    try {
      const queue = player.nodes.get(interaction.guildId);

      //if nothing playing or no queue
      if (!queue || !queue.node.isPlaying())
        return interaction.followUp(`Nothing to skip, sweetie.`);

      await queue.node.skip();
      return interaction.followUp(`**${queue.currentTrack.title}** skipped!`);
    } catch (e) {
      // let's return error if something failed
      return interaction.followUp(`Something went wrong: ${e}`);
    }
  },
};
