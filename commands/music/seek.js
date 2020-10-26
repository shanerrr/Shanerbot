module.exports = { 
    config: {
        name: "seek",
        description: "ok, i'll seek to a certain position.",
        usage: "ur seek <position> ",
        category: "music",
        accessableby: "Members",
        aliases: []
    },
    run: async (client, message, args) => {

        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send("`ok man, go seek some intelligence haha dumb.`").then(msg => msg.delete({timeout: 5000}));
        if (!args[0]) return message.channel.send("`usage: seek <position> ex: ur seek 1:08`").then(msg => msg.delete({timeout: 5000}));
        if (!player.queue.current.isSeekable) return message.react("❌");

        toMil = hmsToSecondsOnly(args[0])    
        try {
            player.seek(toMil);
        } catch (error) {
            return message.channel.send("`ok I seeked to idiocy, idot.`").then(msg => msg.delete({timeout: 5000}));   
        }
        return message.react("⏩");
    }
}
function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s*1000;
}