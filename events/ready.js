const { Client, Collection } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {

    ["commands", "aliases"].forEach(x => client[x] = new Collection());
    ["databaseHandler", "commandHandler", "prefixHandler"].map(x => require(`../config/${x}`)(client));

    client.guildPrefixes = new Map();

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};