module.exports = function (client) {
  client.once("ready", () => {
    console.log("Ready!");
  });

  //create slash commands
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
      //check if interaction exists for current user
      const prevInteraction = client.interactions.get(
        interaction.user.id + interaction.guild.id
      );
      // if (prevInteraction) {
      //   await prevInteraction.deferReply();
      //   await prevInteraction.deleteReply();
      // }

      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(client, interaction);
      } catch (error) {
        console.log(error);
        return interaction.reply({
          content: "You broke me, try again later. :(",
          ephemeral: true,
        });
      }
    }
  });
};
