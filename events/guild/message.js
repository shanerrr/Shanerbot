const { prefix } = require("../../botconfig.json");
const mongoose = require("mongoose");
const User = require('../../models/user');
module.exports = async (client, message) => { 
    if(message.author.bot || message.channel.type === "dm") return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if(!message.content.toLowerCase().startsWith(prefix)) return;

    await User.findOne({userID: message.author.id}, async (err, doc) => { //creates new user in db
        if (err) throw err;
        if (!doc) {
            const newUser = new User({
                _id: mongoose.Types.ObjectId(),
                guild:message.guild.id,
                username:message.author.tag,
                userID: message.author.id,
                playlists:[]
            });
            await newUser.save();
        }
    })

    if(client.cooldown.has(message.author.id)) return;

    if(!(message.author.id == 234743458961555459 || message.author.id == 168603442175148032 || message.author.id == 274682875113111553)){
        client.cooldown.add(message.author.id)
        coolDown(client.cooldown, 5000)
    }
    
    let commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
    if(commandfile) { //for force chat command
        try {
            let guildInfo = client.guildList.find(o => o.guildID === message.guild.id);
            if (guildInfo.fc[0] && !message.member.hasPermission("ADMINISTRATOR")){
                if (guildInfo.fc[0].chat && guildInfo.fc[0].chat != message.channel.id && (commandfile.config.category == "chat" || commandfile.config.category =="ShanerBot")){
                    let chatChannel;
                    await client.channels.fetch(guildInfo.fc[0].chat).then(channel => chatChannel = channel.name);
                    message.reply(`Please use the __**${chatChannel}**__ text channel for chat commands.`).then(msg => msg.delete({timeout: 8000}));
                    return message.delete();
                }
                else if (guildInfo.fc[0].music && guildInfo.fc[0].music != message.channel.id  && commandfile.config.category == "music"){
                    let musicChannel;
                    await client.channels.fetch(guildInfo.fc[0].music).then(channel => musicChannel = channel.name);
                    message.reply(`Please use the __**${musicChannel}**__ text channel for music commands.`).then(msg => msg.delete({timeout: 8000}));
                    return message.delete();
                }
            }         
        }
        catch (UnhandledPromiseRejectionWarning) { //pass
        }
        commandfile.run(client, message, args)
    }

    function coolDown(context, time) {
        setTimeout(() => {
            context.delete(message.author.id)
        }, time)
    }
}