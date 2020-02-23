const {readdirSync} = require("fs");
const {RichEmbed} = require("discord.js")
const {prefix} = require("../../botconfig.json")

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

    const embed = new RichEmbed()
      .setColor("#FF8B00")
      .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL)
      .setThumbnail(client.user.displayAvatarURL)

      if(!args[0]) {
          const categories = readdirSync("./commands/")

          embed.setDescription(`These are the avaliable commands for ${message.guild.me.displayName}\nThe bot prefix is: **${prefix}**`)
          embed.setFooter(`© ${message.guild.me.displayName} | Total Commands: ${client.commands.size}`, client.user.displayAvatarURL);

          categories.forEach(category => {
              const dir = client.commands.filter(c => c.config.category === category)
              const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)
              try {
                  embed.addField(`❯ ${capitalise} [${dir.size}]:`, dir.map(c => `\`${c.config.name}\``).join(" "))
              } catch(e) {
                  console.log(e)
              }
          })

          return message.channel.send(embed)
      } else {
          let command = client.commands.get(client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
          if(!command) return message.channel.send(embed.setTitle("Invalid Command.").setDescription(`Do \`${prefix}help\` for the list of the commands.`))
          command = command.config

          embed.setDescription(stripIndents`The bot's prefix is: \`${prefix}\`\n
          **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}
          **Description:** ${command.description || "No Description provided."}
          **Usage:** ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : "No Usage"}
          **Accessible by:** ${command.accessableby || "Members"}
          **Aliases:** ${command.aliases ? command.aliases.join(", ") : "None."}`)

          return message.channel.send(embed)
        }
  }

}