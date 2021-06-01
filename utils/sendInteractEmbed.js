//this is a functio to deal with slash commands.
module.exports = (args, client, message, msgToSend, response) => {
  if (args.isInteraction) {
    return client.api.interactions(message.id, message.token).callback.post({
      data: {
        type: 4,
        data: {
          embeds: [msgToSend]
        }
      }
    });
  }
  else {
    message.react(response);
    return message.channel.send({ embed: msgToSend });
  }
}