const {ErelaClient, Utils} = require("erela.js")
const {nodes} = require("../../botconfig.json")
const {prefix} = require ("../../botconfig.json");

module.exports = async client => {
    console.log(`Logged in as ${client.user.username}!`);

    client.music = new ErelaClient(client, nodes)
        .on("nodeError", console.log)
        .on("nodeConnect", () => console.log("Created a new Node."))
        .on("trackStuck", ({textChannel}) => textChannel.send("`something bad happened omg, help me.`"))
        .on("nodeError", ({textChannel}) => textChannel.send("`omg im broken.`"))
        .on("playerCreate", player  => {
            player.setVolume(25);
            setInterval(function() {
                if (player.voiceChannel.members.size-1 == 0 || !player.playing){
                    client.music.players.destroy(player.guild.id);
                }
            },600000)        
        });

    client.levels = new Map()
        .set("none", 0.0)
        .set("low", 0.10)
        .set("medium", 0.15)
        .set("high", 0.25);

    let activities = ["im sad", `talk to me?`, "haha hello", "TikTok"], i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]} | ${prefix}help`, { type: "WATCHING" }), 25000)
}