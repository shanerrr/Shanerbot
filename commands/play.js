const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");
const embeds = require("../utils/embed");

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
  async autocomplete(interaction) {
    const player = useMainPlayer();
    const query = interaction.options.getFocused() || " ";

    const results = await player.search(query);

    //Returns a list of songs with their title
    return interaction.respond(
      results.tracks.slice(0, 10).map((t) => ({
        name: `${t.title} - ${t.author} [${t.duration}]`,
        value: t.url,
      }))
    );
  },
  async execute(interaction) {
    if (!interaction.member.voice.channel)
      return await interaction.reply({
        content: "Please join a voice channel first!",
        ephemeral: true,
      });

    await interaction.deferReply();

    const player = useMainPlayer();

    const query = interaction.options.getString("song");
    const searchResult = await player.search(query, {
      requestedBy: interaction.user,
    });

    if (!searchResult.hasTracks()) {
      //Check if we found results for this query
      await interaction.editReply(`We found no tracks for ${query}!`);
    } else {
      await player.play(interaction.member.voice.channel, searchResult, {
        nodeOptions: {
          metadata: interaction.channel,
          //You can add more options over here
        },
      });

      const track = searchResult.tracks[0];
      const queue = useQueue(interaction.guild.id);

      const trackEmbed = embeds.addSongEmbed(track, queue.tracks.size);

      await interaction.editReply({
        embeds: [trackEmbed],
      });
    }
  },
};
