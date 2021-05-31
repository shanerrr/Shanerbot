const Guild = require('../models/Guild');

module.exports = (client) => {

  //creates a map of all the guilds 
  client.guilds.cache.map(async (guild) => {
    const foundGuild = await Guild.findOne({ guildID: guild.id });
    client.guildPrefixes[guild.id] = foundGuild?.prefix || "ur ";
  });

};