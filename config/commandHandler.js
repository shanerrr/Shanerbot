const { readdirSync } = require("fs");

module.exports = (client) => {
  const load = dirs => {
    const commands = readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'));
    for (let file of commands) {
      let pull = require(`../commands/${dirs}/${file}`);
      client.commands.set(pull.config.name, pull);
      if (pull.config.aliases) pull.config.aliases.forEach(a => client.aliases.set(a, pull.config.name));
      //for our slash commands
      client.api.applications(client.user.id).guilds("583564729692454913").commands.post({
        data: {
          name: pull.config.name,
          description: pull.config.description,
          options: pull.config.options
        }
      });
    };
  };
  ["Music", "Guild"].forEach(x => load(x));
};