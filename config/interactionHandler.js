module.exports = (client) => {

  client.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    client.commands.get(command).run(client, interaction, { ...args, isInteraction: true });


    // if (command === 'hello') {
    //   client.api.interactions(interaction.id, interaction.token).callback.post({
    //     data: {
    //       type: 4,
    //       data: {
    //         content: "Hello World!"
    //       }
    //     }
    //   });
    // }
  });
}