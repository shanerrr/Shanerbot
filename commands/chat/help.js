const {readdirSync} = require("fs");
const {MessageEmbed} = require("discord.js")
const {prefix} = require("../../botconfig.json")

module.exports = { 
  config: {
      name: "help",
      description: "man, ill give help with commands.",
      usage: "ur help <command>",
      category: "chat",
      accessableby: "Members",
      aliases: ["h"]
  },
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setColor("#FF8B00")
      .setAuthor(`ShanerBot: Help Panel`, message.guild.iconURL())
      .setThumbnail(client.user.displayAvatarURL())

      if(!args[0]) {
          const categories = readdirSync("./commands/")

          embed.setDescription(`**ShanerBot's prefix is: __${prefix}__**\nThese are the avaliable commands:`)
          embed.setFooter(`ShanerBot: Help (${message.guild.name})`, client.user.displayAvatarURL())

          categories.forEach(category => {
              const dir = client.commands.filter(c => c.config.category === category)
              const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)
              try {
                  embed.addField(`${capitalise} [${dir.size}]:`, dir.map(c => `\`${c.config.name}\``).join(" "))
              } catch(e) {
                  console.log(e)
              }
          });

          return message.channel.send(embed)
      } else {
          let command = client.commands.get(client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
          if(!command) return message.channel.send(embed.setTitle("Invalid Command.").setDescription(`Do \`${prefix}help\` for the list of the commands.`))
          command = command.config

          embed.setDescription(`**ShanerBot's prefix is: __${prefix}__**
          **Description:** ${command.description || "No Description provided."}
          **Usage:** ${command.usage}
          **Aliases:** ${command.aliases ? command.aliases.join(", ") : "None."}`)
          embed.setFooter(`ShanerBot: Help (${message.guild.name})`, client.user.displayAvatarURL())
          .setAuthor(`ShanerBot: ${command.name} Help `, message.guild.iconURL())

          return message.channel.send(embed)
        }
  }

}