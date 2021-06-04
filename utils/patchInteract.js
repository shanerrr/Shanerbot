/**
 * this is a functio to deal with slash commands.
 * @param {*} args basically the command with certain prperties set
 * @param {*} client the discord client 
 * @param {*} message the message or the interact objec
 * @param {*} msgToSend the embed or msg to send
 * @param {*} response the reponse like a status code with https methods
 * @param {*} msgToEdit the message object to edit.
 * @param {*} button a button
 * @returns message object.
 */
module.exports = async (args, client, message, msgToSend, response, msgToEdit = null) => {
  
  if (args.isInteraction) {
    // const data = typeof msgToSend === 'object' ? { embeds: [msgToSend] } : { content: msgToSend }; 
    // ^- this way sometime if there was an embed and you're trying to delete that and replace with normal text, embed will still be there
    const data = typeof msgToSend === 'object' ? { content: null, embeds: Array.isArray(msgToSend) ? msgToSend : [msgToSend] } : { content: msgToSend, embeds: [] };
    const channel = await client.channels.resolve(message.channel_id);

    return client.api.webhooks(client.user.id, message.token).messages('@original').patch({
      data
    }).then((answer) => {
      return channel.messages.fetch(answer.id)
    });
  }
  else {
    response ? message.react(response) : null;
    if (msgToEdit) return msgToEdit.edit(msgToSend)
    return message.channel.send(typeof msgToSend === 'object' ? { embed: msgToSend } : msgToSend);

  }
}