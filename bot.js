const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone: true});
const botconfig = require ("./botconfig.json");
const fetch = require('node-fetch');

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("ur help", {type: "LISTENING"})
});

client.on("message", async msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
  let prefix = botconfig.prefix;
  // let messageArray = msg.content.split(" ");
  // let cmd = messageArray[0];
  // let args = messageArray.slice(1);

  if(msg.content === `${prefix}test`){
    let sembed = new Discord.RichEmbed()
    .setColor("#ff00d9")
    .setTitle("UserInfo")
    .setDescription("dssds")
    .setAuthor(`${msg.guild.name}`)
    .addField("**guild name:**", `${msg.guild.name}`, true)
    .addField("guild ownser:", `${msg.guild.owner}`, true)
    .addField("memeber count", `${msg.guild.memberCount}`, true)
    .setFooter("Shanerbot", client.user.displayAvatarURL);
    msg.channel.send({embed: sembed});

  }
  if(msg.content === `${prefix}hahameme`){

    fetch('https://apis.duncte123.me/meme')
    .then(res => res.json()).then(body => {
      if (!body) return msg.channel.send("``haha no meme for u, idot.``")
      let mEmbed = new Discord.RichEmbed()
      .setTitle(body.data['title'])
      .setColor("#ff00d9")
      .setFooter("ShanerBot", client.user.displayAvatarURL)
      .setImage(body.data['image'])
        msg.channel.send({embed: mEmbed})
    })
  }




});

client.login(botconfig.token);