const {ErelaClient, Utils} = require("erela.js")
const {nodes} = require("../../botconfig.json")

module.exports = async client => {
    console.log(`Logged in as ${client.user.username}!`);
    //client.user.setActivity("ur help", {type: "WATCHING"});

    client.music = new ErelaClient(client, nodes)
        .on("nodeError", console.log)
        .on("nodeConnect", () => console.log("Created a new Node."))
        // .on("queueEnd", player => {
        //     player.textChannel.send("Queue has ended.")
        //     return client.music.players.destroy(player.guild.id) //bot leaves cahnnel
        // }
        // .on("trackStart", ({textChannel}, {title, duration}) => textChannel.send(`Now playing: **${title}** \`${Utils.formatTime(duration, true)}\``).then(m => m.delete(15000)));

    client.levels = new Map()
        .set("none", 0.0)
        .set("low", 0.10)
        .set("medium", 0.15)
        .set("high", 0.25);
        
    let mstatus = [
        "pls invite me man",
        "haha hello",
        "ur help",
        "kiss me",
        "TikTok"
    ]

    setInterval(function() {
        let status = mstatus[Math.floor(Math.random() * mstatus.length)];
        client.user.setActivity(status, {type: "WATCHING"});
    }, 10000)
}