module.exports = { 
    config: {
        name: "volume",
        description: "ok, i'll lower the volume, idot.",
        usage: "ur <vol|volume> <input>",
        category: "music",
        accessableby: "Members",
        aliases: ["vol"]
    },
    run: async (client, message, args) => {

        const player = client.music.players.get(message.guild.id);
        if (!player) return message.channel.send("`yeah man, ill changed the volume of this imaginary song, k did it.`");
        if (!args[0]) return message.channel.send("`"+`dude, the volume is at ${player.volume}%.`+"`");
        if (!Number.isInteger(Number(args[0]))) return message.channel.send("`hey man, u need to put a number in, u know, to change the volume, idot.`");

        if (Number(args[0]) <= 0) return message.channel.send("`huh? ur want less than 0? just mute me then. Also, youre not my friend bye man.`");
        if (Number(args[0]) > 100) return message.channel.send("`ur must be a different kind of stupid, ur want more than 100%? idot pls ur idot.`");
        player.setVolume(Number(args[0]));
        return message.channel.send("`🔊 ur got it, volume is now at "+`${args[0]}%`+".`");
    }
}