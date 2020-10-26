const { Manager } = require("erela.js");
const {nodes, prefix, token} = require ("../../botconfig.json");
const flatfile = require('flat-file-db');

module.exports = async client => {
    client.database = flatfile.sync('../../db.db');
    //client.report = flatfile.sync('../../Rdb.db');
    client.playlist = flatfile.sync('playlistdb.db');
    client.playlistkeys = flatfile.sync('playlistkeysdb.db');
    
    client.manager = new Manager({
        // The nodes to connect to, optional if using default lavalink options
        nodes,
        // Automatically play the next track
        autoPlay: true,
        // Method to send voice data to Discord
        send: (id, payload) => {
          const guild = client.guilds.cache.get(id);
          // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
          if (guild) guild.shard.send(payload);
        }
    });

    client.manager.on("nodeConnect", node => {
        console.log(`Node "${node.options.identifier}" connected.`)
    })
    client.manager.on("nodeError", (node, error) => {
        console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
    })
    client.manager.on("trackStuck", (player) => player.textChannel.send("`something bad happened omg, help me.`"))
    client.manager.on("playerCreate", player  => {
        player.setVolume(10);
        if (!client.channels.cache.get(player.textChannel).permissionsFor(client.user).has("ADD_REACTIONS")) player.textChannel.send("`Please enable Add Reactions permission for ShanerBot for this text channel or provide ShanerBot with a role.`")
            player.disconnect = setInterval(function() {
            if (client.channels.cache.get(player.voiceChannel).members.size == 1 || player.playing == false || player.voiceChannel.guild.me.voice.serverMute){
                client.manager.players.destroy(player.guild.id);
                clearInterval(player.disconnect);
            }
            },5000);                    
    })
    client.manager.on("playerDestroy", player  => {
        clearInterval(player.disconnect);});
    client.on("raw", d => client.manager.updateVoiceState(d));  

    client.cooldown = new Set();
    client.reportcooldown = new Set();
    client.forcecooldown = new Set(); 
    client.retry = new Map(); 
    client.vote = new Map();
    client.query = new Map();
    let activities = ["Supports playlists!", `talk to me?`, "haha hello", "TikTok", "quarantine"], i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]} | ${prefix}help`, { type: "WATCHING" }), 25000)
}

// // Require both libraries
// const { Client } = require("discord.js");
// const { Manager } = require("erela.js");
// const {nodes, prefix, token} = require ("../../botconfig.json");

// // Initiate both main classes
// const client = new Client();

// // Assign Manager to the client variable
// client.manager = new Manager({
//   // The nodes to connect to, optional if using default lavalink options
//   nodes,
//   // Automatically play the next track
//   autoPlay: true,
//   // Method to send voice data to Discord
//   send: (id, payload) => {
//     const guild = client.guilds.cache.get(id);
//     // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
//     if (guild) guild.shard.send(payload);
//   }
// });

// // Emitted whenever a node connects
// client.manager.on("nodeConnect", node => {
//     console.log(`Node "${node.options.identifier}" connected.`)
// })

// // Emitted whenever a node encountered an error
// client.manager.on("nodeError", (node, error) => {
//     console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
// })

// // Listen for when the client becomes ready
// client.once("ready", () => {
//   // Initiates the manager and connects to all the nodes
//   client.manager.init(client.user.id);
//   console.log(`Logged in as ${client.user.tag}`);
// });

// // THIS IS REQUIRED. Send raw events to Erela.js
// client.on("raw", d => client.manager.updateVoiceState(d));

// // Finally login at the END of your code
// client.login(token);