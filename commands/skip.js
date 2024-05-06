const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current playing song."),
  async execute(interaction) {
    if (!interaction.member.voice.channel)
      return await interaction.reply({
        content: "Please join a voice channel first!",
        ephemeral: true,
      });

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();

    const queue = useQueue(interaction.guild.id);

    //if nothing playing or no queue
    if (!queue || !queue.node.isPlaying())
      return await interaction.editReply(`Nothing to skip, sweetie.`);

    await interaction.editReply(
      `**${queue.currentTrack.title} - ${queue.currentTrack.author}** skipped!`
    );
    queue.node.skip();
  },
};
