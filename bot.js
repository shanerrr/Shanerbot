const {Client, Collection} = require('discord.js');
const {token} = require ("./botconfig.json");
const client = new Client();

["commands", "aliases"].forEach(x => client[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handlers/${x}`)(client));

client.once("ready", () => {
    client.manager.init(client.user.id);
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(token)