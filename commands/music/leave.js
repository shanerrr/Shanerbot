module.exports = { 
    config: {
        name: "leave",
        description: "ok i leave bye.",
        usage: "ur leave",
        category: "music",
        accessableby: "Members",
        aliases: []
    },
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if(!player) return message.channel.send("`man ur know im not connected to a channel, idot.`").then(msg => msg.delete({timeout: 5000}));
        const {channel} = message.member.voice;

        if (message.member.hasPermission("ADMINSTRATOR")){
            player.disconnect();
            return message.react("😔")
        } else{
            if(!channel || channel.id !== player.voiceChannel) {
                message.react("❌");
                return message.channel.send("`haha, can't make me leave when im not in the same voice channel as you.`").then(msg => msg.delete({timeout: 5000}));
            }
            if (channel.members.size <= 2 || !player.queue.size){
                player.disconnect();
                return message.react("😔")
            }
            else{
                message.react("❌");
                return message.channel.send("✌ "+"`Sorry bro, I'm not listening to you because I kinda don't like you. `").then(msg => msg.delete({timeout: 5000}));
            }
        }
    }
}