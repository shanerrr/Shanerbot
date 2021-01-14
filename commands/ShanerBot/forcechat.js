const {MessageEmbed} = require("discord.js");
const Guild = require('../../models/guild');
module.exports = { 
  config: {
      name: "forcechat",
      description: "The text channel that the command is ran on will force the bot to only accept commands in that channel.",
      usage: "ur forcechat [music/meme] [on/off]",
      category: "ShanerBot",
      accessableby: "Administrator",
      aliases: ["fc"]
  },
  run: async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.react("❌");
    const foundGuild = await Guild.findOne ({ guildID: message.guild.id });
    let musicChannel, chatChannel;
    try {
      await client.channels.fetch(foundGuild.fc[0].music).then(channel => musicChannel = channel.name);
    } catch (UnhandledPromiseRejectionWarning){//pass
    }
    try{
      await client.channels.fetch(foundGuild.fc[0].chat).then(channel => chatChannel = channel.name);
    } catch(UnhandledPromiseRejectionWarning) {//pass
    }

    if (!args.length) {
      let qEmbed = new MessageEmbed()
        .setTitle("Force Chat Command")
        .setColor("#4900FF")
        .setFooter(`ShanerBot: ForceChat (${message.guild.name})`, client.user.displayAvatarURL())
        .setDescription(`Using this command, you can force certain commands to be used in only certain channels. `)
        .addField('**MUSIC:**', foundGuild.fc[0].music ? `Currently set to textchannel: __**${musicChannel}**__` : 'Music commands can be accepted from any channel. ' , false)
        .addField('**CHAT:**', foundGuild.fc[0].chat ? `Currently set to textchannel __**${chatChannel}**__` : 'Chat commands can be accepted from any channel. ' , false)
        .addField('\u200b', '**``ur fc on:``**'+' This will enable all commands to only be used in this channel.', false)
        .addField('\u200b', '**``ur fc music:``**'+' This will enable all music commands to only be used in this channel.', false)
        .addField('\u200b', '**``ur fc chat:``**'+' This will enable all chat/memes commands to only be used in this channel.', false)
        .addField('\u200b', '**``ur fc off:``**'+' This will disable any enabled force chat on this channel', false)
      message.channel.send({embed:qEmbed}).then(msg => msg.delete({timeout: 30000}));

    }
    else{
        if (args[0].toUpperCase() === "OFF"){
          message.react("✅");
          message.reply(`Commands can be used in any text channels now.`).then(msg => msg.delete({timeout: 10000}));
          return await Guild.updateOne(foundGuild, {
            $set: {fc: {                
                music: null,
                chat: null,
                both: false,
                }
            }   
          });
        } else if(args[0].toUpperCase() === "ON"){
          if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send("`Sorry, I dont have the` "+"__**`MANAGE MESSAGES`**__"+" `permission to enfore this rule.`").then(msg => msg.delete({timeout: 10000}));
            message.react("✅");
            message.reply(`Commands can only now be used in this channel.`).then(msg => msg.delete({timeout: 10000}));
            return await Guild.updateOne(foundGuild, {
              $set: {fc: {                
                  music: message.channel.id,
                  chat: message.channel.id,
                  both: true,
                  }
              }   
            });
        } else if (args[0].toUpperCase() === "CHAT"){
            if (args[1] && args[1].toUpperCase() == "ON") {
              if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send("`Sorry, I dont have the` "+"__**`MANAGE MESSAGES`**__"+" `permission to enfore this rule.`").then(msg => msg.delete({timeout: 10000}));
              message.reply(`Chat category commands can only now be used in this channel from now on.`).then(msg => msg.delete({timeout: 10000}));
              await Guild.updateOne(foundGuild, {
                $set: {fc: {                
                    music: foundGuild.fc[0].music,
                    chat: message.channel.id,
                    both: foundGuild.fc[0].music==message.channel.id
                  }
                }   
              });
              return message.react("✅");
            } else if (args[1] && args[1].toUpperCase() == "OFF"){
                await Guild.updateOne(foundGuild, {
                  $set: {fc: {
                      music: foundGuild.fc[0].music,                
                      chat: null,
                      both: false
                    }
                  }   
                });
                return message.react("✅");
            } else {
              return message.channel.send("`Hey, you want it on or off? ex: ur fc chat on`").then(msg => msg.delete({timeout: 5000}));
            }
        } else if (args[0].toUpperCase() === "MUSIC"){
            if (args[1] && args[1].toUpperCase() == "ON") {
              if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send("`Sorry, I dont have the` "+"__**`MANAGE MESSAGES`**__"+" `permission to enfore this rule.`").then(msg => msg.delete({timeout: 10000}));
              message.reply(`Music category commands can only now be used in this channel from now on.`).then(msg => msg.delete({timeout: 10000}));
              await Guild.updateOne(foundGuild, {
                $set: {fc: {                
                    music: message.channel.id,
                    chat: foundGuild.fc[0].chat,
                    both: foundGuild.fc[0].chat==message.channel.id
                  }
                }   
              });
              return message.react("✅");
            }
            else if (args[1] && args[1].toUpperCase() == "OFF"){
              await Guild.updateOne(foundGuild, {
                $set: {fc: {                
                    music: null,
                    chat: foundGuild.fc[0].chat,
                    both: false
                  }
                }   
              });
              return message.react("✅");
            } else{
              return message.channel.send("`Hey, you want it on or off? ex: ur fc music on`").then(msg => msg.delete({timeout: 5000}));
            }
        } else{
          return message.channel.send("I only have two options: __**Music**__ and __**Chat**__. | usage: ur fc music on -> will enable all music commands to the channel you type this command in.").then(msg => msg.delete({timeout: 10000}));
        }
    }
  }
}

