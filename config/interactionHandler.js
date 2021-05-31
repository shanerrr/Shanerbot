module.exports = (client) => {

  //creates websocket for slash commands
  client.ws.on('INTERACTION_CREATE', async interaction => {

    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;
    client.commands.get(command).run(client, interaction, { ...args, isInteraction: true });

  });
}