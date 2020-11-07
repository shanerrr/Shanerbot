const { Manager } = require("erela.js");
const Spotify  = require("erela.js-spotify");
const {nodes, prefix, spotifyClientID, spotifySecret} = require ("../../botconfig.json");
const flatfile = require('flat-file-db');

module.exports = async client => {
    const clientID = spotifyClientID;
    const clientSecret = spotifySecret;
    // client.database = flatfile.sync('../../db.db');
    // //client.report = flatfile.sync('../../Rdb.db');
    // client.playlist = flatfile.sync('playlistdb.db');
    // client.playlistkeys = flatfile.sync('playlistkeysdb.db');
    
    client.manager = new Manager({
        nodes,
        autoPlay: true,
        send: (id, payload) => {
          const guild = client.guilds.cache.get(id);
          if (guild) guild.shard.send(payload);
        },
        plugins: [ new Spotify({ clientID, clientSecret }) ]
    });

    client.manager.on("nodeConnect", node => {
        console.log(`Node "${node.options.identifier}" connected.`)
    })
    client.manager.on("nodeError", (node, error) => {
        console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
    })
    client.manager.on("trackStuck", (player) => player.textChannel.send("`something bad happened omg, help me.`"))
    client.manager.on("playerCreate", (player)  => {
        player.setVolume(10);
        if (!client.channels.cache.get(player.textChannel).permissionsFor(client.user).has("ADD_REACTIONS")) player.textChannel.send("`Please enable Add Reactions permission for ShanerBot for this text channel or provide ShanerBot with a role.`")
            player.disc = setInterval(function() {
            if (client.channels.cache.get(player.voiceChannel).members.size == 1 || player.playing == false || client.channels.cache.get(player.voiceChannel).guild.me.voice.serverMute){
                player.destroy();
                clearInterval(player.disc);
            }
            },600000);                    
    })
    client.manager.on("playerDestroy", player  => {
        clearInterval(player.disc);});
    client.on("raw", d => client.manager.updateVoiceState(d));  

    client.cooldown = new Set();
    client.forcecooldown = new Set(); 
    client.retry = new Map(); 
    client.vote = new Map();
    client.query = new Map();
    let activities = ["Supports playlists!", `talk to me?`, "haha hello", "TikTok", "quarantine"], i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]} | ${prefix}help`, { type: "WATCHING" }), 25000)
}