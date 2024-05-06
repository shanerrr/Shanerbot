const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

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
  async execute(_, interaction) {
    const player = useMainPlayer();
    const query = interaction.options.getString("song");
    const searchResult = await player.search(query, {
      requestedBy: interaction.user,
    });

    if (!searchResult.hasTracks()) {
      //Check if we found results for this query
      await interaction.reply(`We found no tracks for ${query}!`);
      return;
    } else {
      await player.play(interaction.member.voice.channel, searchResult, {
        nodeOptions: {
          metadata: interaction.channel,
          //You can add more options over here
        },
      });
    }
    await interaction.reply({
      content: `Playing **${searchResult.tracks[0].title}** by **${searchResult.tracks[0].author}**`,
    });
  },
  async autocompleteExecute(client, interaction) {
    const player = useMainPlayer();
    const query = interaction.options.getString("song", true) || " ";
    const results = await player.search(query);

    //Returns a list of songs with their title
    return interaction.respond(
      results.tracks.slice(0, 10).map((t) => ({
        name: t.title,
        value: t.url,
      }))
    );
  },
};
