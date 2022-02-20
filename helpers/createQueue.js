module.exports.createQueue = async function (client, interaction) {
  const queue = await client.player.createQueue(interaction.guild, {
    ytdlOptions: {
      filter: "audioonly",
      highWaterMark: 1 << 30,
      dlChunkSize: 0,
    },
    metadata: {
      interaction: interaction.channel,
    },
    leaveOnEmptyCooldown: 600000,
    leaveOnEnd: false,
    leaveOnStop: false,
    leaveOnEmpty: false,
  });

  // verify vc connection
  try {
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);
  } catch {
    queue.destroy();
    return await interaction.reply({
      content: "Could not join your voice channel!",
      ephemeral: true,
    });
  }

  return queue;
};
