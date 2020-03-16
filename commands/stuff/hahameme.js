const {MessageEmbed} = require("discord.js")
const fetch = require('node-fetch');

module.exports = { 
  config: {
      name: "hahameme",
      description: "man, its a meme from a website ok.",
      usage: "ur hahameme",
      category: "stuff",
      accessableby: "Members",
      aliases: ["meme"]
  },
  run: async (client, message, args) => {
    fetch('https://apis.duncte123.me/meme')
    .then(res => res.json()).then(body => {
      if (!body) return msg.channel.send("``haha no meme for u, idot.``")
      let mEmbed = new MessageEmbed()
      .setTitle(body.data['title'])
      .setColor("#FF8B00")
      .setFooter(`ShanerBot: Meme (${message.guild.name})`, client.user.displayAvatarURL)
      .setImage(body.data['image'])
        message.channel.send({embed: mEmbed})
    })
  }

}