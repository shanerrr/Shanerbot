const fs = require("fs");
const { Collection } = require("discord.js");

//initilizes commands
module.exports = function (client) {
  client.commands = new Collection();
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
  }

  //captures old intneractions to cancel if more than one interaction active.
  client.interactions = new Collection();
};
