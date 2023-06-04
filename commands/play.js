const { SlashCommandBuilder } = require("discord.js");
const { useMasterPlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song or adds to the current queue.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("A song name or url")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(client, interaction) {
    if (!interaction.channelId)
      return await interaction.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      });

    const query = interaction.options.getString("song", true); // we need input/query to play

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();

    try {
      const { track } = await client.player.play(
        interaction.member.voice.channel,
        query,
        {
          nodeOptions: {
            // nodeOptions are the options for guild node (aka your queue in simple word)
            metadata: interaction, // we can access this metadata object using queue.metadata later on
            volume: 100,
            leaveOnStop: false,
            leaveOnEmpty: false,
            leaveOnEndCooldown: 300000, // 5 minutes
            leaveOnEmptyCooldown: 30000, // 30 seconds
          },
        }
      );

      return interaction.followUp(
        `**${track.title} - ${track.author}** enqueued!`
      );
    } catch (e) {
      // let's return error if something failed
      return interaction.followUp(`Something went wrong: ${e}`);
    }
  },
  async autocompleteExecute(client, interaction) {
    try {
      const query = interaction.options.getString("song", true);
      if (!query) {
        return interaction.respond([
          {
            name: "Need more info on the song.",
            value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
        ]);
      }
      const results = await client.player.search(query);

      //Returns a list of songs with their title
      return interaction.respond(
        results.tracks.slice(0, 10).map((t) => ({
          name: `${t.title} - ${t.author} [${t.duration}]`.substring(0, 100),
          value: t.url,
        }))
      );
    } catch (e) {
      console.log(e);
    }
  },
};
