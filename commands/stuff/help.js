const {RichEmbed} = require("discord.js")

module.exports = { 
  config: {
      name: "help",
      description: "man, ill give help with commands",
      usage: "ur help <command>",
      category: "stuff",
      accessableby: "Members",
      aliases: ["h"]
  },
  run: async (client, message, args) => {

  }

}