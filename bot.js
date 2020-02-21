const {Client, Collection} = require('discord.js');
const {token} = require ("./botconfig.json");
const client = new Client();

// fs.readdir("./commands/", (err, files) => {

//   if (err) console.log(err)
//   let jsfile = files.filter(f => f.split(".").pop() === "js")
//   if(jsfile.length <= 0) {
//     return console.log("Commands: Could not find.");
//   }
//   jsfile.forEach((f, i) => {
//     let pull = require(`./commands/${f}`);
//     client.commands.set(pull.config.name, pull);
//     pull.config.aliases.forEach(alias => {
//       client.aliases.set(alias, pull.config.name)
//     });
//   });
// });

["commands", "aliases"].forEach(x => client[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handlers/${x}`)(client));


// client.on("message", async msg => {
//   if (msg.content === 'ping') {
//     msg.reply('pong');
//   }
//   let prefix = botconfig.prefix;
//   let messageArray = msg.content.split(" ");
//   let cmd = messageArray[0];
//   let args = messageArray.slice(1);

//   let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
//   if(commandfile) commandfile.run(client, msg, args)


  // if(msg.content === `${prefix}test`){
  //   let sembed = new Discord.RichEmbed()
  //   .setColor("#ff00d9")
  //   .setTitle("UserInfo")
  //   .setDescription("dssds")
  //   .setAuthor(`${msg.guild.name}`)
  //   .addField("**guild name:**", `${msg.guild.name}`, true)
  //   .addField("guild ownser:", `${msg.guild.owner}`, true)
  //   .addField("memeber count", `${msg.guild.memberCount}`, true)
  //   .setFooter("Shanerbot", client.user.displayAvatarURL);
  //   msg.channel.send({embed: sembed});

  // }




// });

client.login(token);