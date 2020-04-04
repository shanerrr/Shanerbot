const {prefix} = require ("../../botconfig.json");
const {MessageEmbed} = require("discord.js")

module.exports = async (client, guild) => {

    const aEmbed = new MessageEmbed()
    .setTitle("**ShanerBot** - The best Discord bot")
    .setDescription(`👋 omg thanks for inviting me to your discord server.\nIt really means a lot.\n\nTyping **${prefix}help** will provide all current available commands.`)
    .setThumbnail(client.user.displayAvatarURL())
    .setColor("#ff0000");
    
    let SendChannel = guild.channels.cache.find(TextChannel => TextChannel.name === "general") || guild.channels.cache.find(TextChannel => TextChannel.name === "chat");
    if(SendChannel) {
        if (SendChannel.permissionsFor(guild.me).has("SEND_MESSAGES")){
            SendChannel.send(aEmbed);
        }
    }
    else{
        let defaultChannel = "";
        guild.channels.cache.forEach((channel) => {
            if(channel.type == "text" && defaultChannel == "") {
                if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
                }
            }
        })
        defaultChannel.send(aEmbed);
    }
}