const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const { nodes, clientID, clientSecret } = require("../config.json");
// const Guild = require('../../models/guild');

module.exports = async client => {

  client.manager = new Manager({
    nodes,
    autoPlay: true,
    send(id, payload) {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
    plugins: [new Spotify({ clientID, clientSecret })],
  })
    .on("nodeConnect", node => {
      console.log(`Node "${node.options.identifier}" connected.`)
    })
    .on("nodeError", (node, error) => {
      console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
    })
    .on("trackStuck", (player) => player.textChannel.send("`something bad happened omg, help me.`"))
    .on("playerCreate", (player) => {
      // if (!client.channels.cache.get(player.textChannel).permissionsFor(client.user).has("ADD_REACTIONS")) player.textChannel.send("`Please enable Add Reactions permission for ShanerBot for this text channel or provide ShanerBot with a role.`")
      // player.disc = setInterval(function () {
      //   if (client.channels.cache.get(player.voiceChannel).members.size == 1 || player.playing == false || client.channels.cache.get(player.voiceChannel).guild.me.voice.serverMute) {
      //     player.destroy();
      //     clearInterval(player.disc);
      //   }
      // }, 600000);
    })
    .on("playerDestroy", player => {
      clearInterval(player.disc);
    });

  client.on("raw", d => client.manager.updateVoiceState(d));

  // client.cooldown = new Set();
  // client.guildList = await Guild.find({}); //initally stores to a list to avoid always being called in message event of bot
  // //client.forcecooldown = new Set(); 
  // client.vote = new Map();
  // client.query = new Map();
  // let activities = ["Supports playlists!", `talk to me?`, "haha hello", "TikTok", "quarantine"], i = 0;
  // setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]} | ${prefix}help`, { type: "WATCHING" }), 25000)
}