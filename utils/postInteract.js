
/**
 * this is a functio to deal with slash commands.
 * @param {*} args basically the command with certain prperties set
 * @param {*} client the discord client 
 * @param {*} message the message or the interact objec
 * @param {*} msgToSend the embed or msg to send
 * @param {*} response the reponse like a status code with https methods
 * @param {*} ephemeral if you want only the person to see it - message can be dismssed - only for interactive.
 * @returns message object.
 */
module.exports = (args, client, message, msgToSend, response, ephemeral = null) => {

  if (args.isInteraction) {

    //see if its an embed or normal message.
    const data = typeof msgToSend === 'object' ? { embeds: [msgToSend], flags: ephemeral } : { content: msgToSend, flags: ephemeral };
    return client.api.interactions(message.id, message.token).callback.post({
      data: {
        type: 4,
        data
      }
    });
  }
  else {
    response ? message.react(response) : null;
    return message.channel.send({ embed: msgToSend });
  }
}