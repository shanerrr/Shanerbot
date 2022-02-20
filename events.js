module.exports = function (client) {
  client.once("ready", () => {
    console.log("Ready!");
  });

  //create slash commands
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
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
