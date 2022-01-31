const { Player } = require("discord-player");
const { ytCookie } = require("./config.json");
require("discord-player/smoothVolume");

module.exports = function (client) {
  // instantiate the player
  client.player = new Player(client, {
    ytdlOptions: {
      headers: {
        cookie: ytCookie,
      },
    },
  });

  client.player.on("connectionError", (queue, error) => {
    console.log(
      `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
    );
  });
};
