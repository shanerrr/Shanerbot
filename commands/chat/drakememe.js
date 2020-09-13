const {MessageEmbed} = require("discord.js")
const fetch = require('node-fetch');

module.exports = { 
  config: {
      name: "drakememe",
      description: "man, its a drake meme generator.",
      usage: "ur drakememe <first sentence>/<second sentence>",
      category: "chat",
      accessableby: "Members",
      aliases: ["drakem"]
  },
  run: async (client, message, args) => {

    if (!args[0]) return message.channel.send("`dude, its a meme generation, put a string to make it haha.`");
    const textgen = args.join(" ").split("/");
    if ((textgen[0] == null || textgen[0] == "")|| (textgen[1] == null || textgen[1] == "")) return message.channel.send("`you need to enter two strings seperated by a slash. ex: ur drakememe your text/goes here`");

    fetch(`https://memegen.link/api/templates/drake/${textgen[0]}/${textgen[1]}`)
    .then(res => res.json()).then(body => {
        if (!body) return msg.channel.send("``haha no meme for u, idot.``")
        let mEmbed = new MessageEmbed()
        .setColor("#FF8B00")
        .setTitle("🔗 Click Me!")
        .setURL(body.direct['visible'])
        .setFooter(`ShanerBot: DrakeMemeGen (${message.guild.name})`, client.user.displayAvatarURL())
        .setImage(body.direct['visible'])
        message.channel.send({embed: mEmbed})
    });
 } 
}

