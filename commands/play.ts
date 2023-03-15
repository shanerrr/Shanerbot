import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song or adds to the current queue.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("A song name or url")
        .setRequired(true)
    ),
  async execute(client: Client, interaction: any) {
    if (!interaction.channelId)
      return await interaction.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      });

    console.log(await interaction.channel?.fetch(), interaction.member.voice.channel);
    const query = interaction.options.getString("song", true); // we need input/query to play

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();

    try {
      const { track } = await (client as any).player.play(
        interaction.member.voice.channel,
        query,
        {
          nodeOptions: {
            // nodeOptions are the options for guild node (aka your queue in simple word)
            metadata: interaction, // we can access this metadata object using queue.metadata later on
          },
        }
      );

      return interaction.followUp(`**${track.title}** enqueued!`);
    } catch (e) {
      // let's return error if something failed
      return interaction.followUp(`Something went wrong: ${e}`);
    }
  },
};
