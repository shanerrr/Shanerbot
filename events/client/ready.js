const {ErelaClient} = require("erela.js")
const {nodes} = require("../../botconfig.json")
const {prefix} = require ("../../botconfig.json");
const flatfile = require('flat-file-db');

module.exports = async client => {
    console.log(`Logged in as ${client.user.username}!`);
    client.database = flatfile.sync('../../db.db');
    
    client.music = new ErelaClient(client, nodes)
        .on("nodeError", console.log)
        .on("nodeConnect", () => console.log("Created a new Node."))
        .on("trackStuck", (player) => player.textChannel.send("`something bad happened omg, help me.`"))
        .on("playerCreate", player  => {
            player.setVolume(10);
            if (!player.textChannel.permissionsFor(client.user).has("ADD_REACTIONS")) player.textChannel.send("`Please enable Add Reactions permission for ShanerBot for this text channel or provide ShanerBot with a role.`")
            player.disconnect = setInterval(function() {
                if (player.voiceChannel.members.size == 1 || player.playing == false || player.voiceChannel.guild.me.voice.serverMute){
                    client.music.players.destroy(player.guild.id);
                    clearInterval(player.disconnect);
                }
            },600000);                    
        })
        .on("playerDestroy", player  => {
            clearInterval(player.disconnect);});


    client.cooldown = new Set();
    client.forcecooldown = new Set(); 
    client.retry = new Map(); 
    client.vote = new Map();
    client.query = new Map();
    let activities = ["im sad", `talk to me?`, "haha hello", "TikTok", "quarantine"], i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]} | ${prefix}help`, { type: "WATCHING" }), 25000)
}