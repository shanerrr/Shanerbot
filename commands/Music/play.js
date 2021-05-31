// const { MessageEmbed } = require("discord.js");
const Guild = require('../../models/Guild');

module.exports = {
  config: {
    name: "play",
    description: "Plays a song or adds to the queue.",
    usage: "<guild-set-prefix> play <song query/youtube url>",
    category: "Music",
    accessableby: "Members",
    aliases: [],
    options: [{
      name: "query",
      description: "Search for a song or direct url.",
      type: 3,
      required: true
    }]
  },
  run: async (client, message, args) => {

    //to deal with slash commands and what not.
    const sendMessage = (msg, isOk) => {
      if (args.isInteraction) {
        return client.api.interactions(message.id, message.token).callback.post({
          data: {
            type: 4,
            data: {
              content: msg
            }
          }
        });
      }
      else {
        isOk ? message.react("👍") : message.react("❌");
        return message.channel.send(msg).then(msg => msg.delete({ timeout: 5000 }));
      }
    }

    const bundledPrefix = args.isInteraction ? args['0'].value : args?.content.join(' ') || ""
    //Error handling
    if (!bundledPrefix) return sendMessage("❌ : Empty argument. Please rerun command with an argument.");
    else if (bundledPrefix.length > 3) return sendMessage("❌ : You need to add a prefix that is no more than 3 characters long.");

    //logic
    await Guild.findOneAndUpdate({ guildID: message.guild?.id || message.guild_id }, { prefix: bundledPrefix }, (err, _) => {

      //error with DB
      if (err) return sendMessage("❌ : Weird issue, try again later. ");
      //SUCESS
      else {
        client.guildPrefixes[message.guild?.id || message.guild_id] = bundledPrefix;
        return sendMessage(`👍 : Changes set. Prefix for this server is now **${bundledPrefix}**`, true);
      }
    });
  }
}

