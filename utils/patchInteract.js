/**
 * this is a functio to deal with slash commands.
 * @param {*} args basically the command with certain prperties set
 * @param {*} client the discord client 
 * @param {*} message the message or the interact objec
 * @param {*} msgToSend the embed or msg to send
 * @param {*} response the reponse like a status code with https methods
 * @param {*} msgToEdit the message object to edit.
 * @returns message object.
 */
module.exports = async (args, client, message, msgToSend, response, msgToEdit = null) => {

  console.log(msgToEdit)
  if (args.isInteraction) {
    // console.log(msgToSend);
    const data = typeof msgToSend === 'object' ? { embeds: [msgToSend] } : { content: msgToSend };
    // console.log(data);
    const channel = await client.channels.resolve(message.channel_id);

    return client.api.webhooks(client.user.id, message.token).messages('@original').patch({
      data
    }).then((answer) => {
      return channel.messages.fetch(answer.id)
    });
  }
  else {
    message.react(response);
    if (msgToEdit) return msgToEdit.edit(msgToSend)
    return message.channel.send({ embed: msgToSend });

  }
}