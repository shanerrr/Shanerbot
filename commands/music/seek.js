const prettyMilliseconds = require('pretty-ms');
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

        const player = client.music.players.get(message.guild.id);
        if (!player) return message.channel.send("`ok man, go seek some intelligence haha dumb.`");
        if (!args[0]) return message.channel.send("`usage: seek <position> ex: ur seek 1:08`");

        toMil = hmsToSecondsOnly(args[0])    
        try {
            player.seek(toMil);
        } catch (error) {
            return message.channel.send("`ok I seeked to idiocy, idot.`");   
        }
        return message.channel.send("`ok, seeked to position "+`${args[0]}`+".`");
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