const sendMessage = require('../../utils/patchInteract');
const initalInteract = require('../../utils/initalInteract');

module.exports = {
  config: {
    name: "lyrics",
    description: "Fetches the lyrics for the current playing song.",
    usage: "<guild-set-prefix> lyrics",
    category: "Music",
    accessableby: "Members",
    aliases: ["l"],
    options: []
  },
  run: async (client, message, args) => {

    args.isInteraction ? initalInteract(client, message) : null;
    sendMessage(args, client, message, "OOPS", "👍");

  }
}