const { Player } = require("discord-player");
const extractor = require("./utils/extractor");
require("discord-player/smoothVolume");

module.exports = function (client) {
  // instantiate the player
  client.player = new Player(client);
  client.player.use("shaner", extractor);
  client.player.on("connectionError", (queue, error) => {
    console.log(
      `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
    );
  });
};
