//this is a functio to deal with inital thinking stage.
module.exports = (client, message) => {
  client.api.interactions(message.id, message.token).callback.post({
    data: {
      type: 5,
    },
  })
}