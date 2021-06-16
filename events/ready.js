const { Collection } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {

    //global maps /vars
    client.guildPrefixes = new Map();

    //commands and other handlers
    ["commands", "aliases"].forEach(x => client[x] = new Collection());
    ["databaseHandler", "commandHandler", "prefixHandler", "interactionHandler", "erelaHandler"].map(x => require(`../config/${x}`)(client));

    //for lavalink erela.js
    client.manager.init(client.user.id);

    console.log(`Ready! Logged in as ${client.user.tag}`);

    let activities = ["Slash Commands!", "str8 chillin'"], i = 0;
    setInterval(() => client.user.setActivity(activities[i++ % activities.length], { type: "COMPETING" }), 25000);
  },
};