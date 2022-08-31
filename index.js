const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
//init commands
require("./handler")(client);
//init player
require("./player")(client);
//events
require("./events")(client);

let activities = ["your mom", "depression", "myself :("],
  i = 0;
setInterval(
  () =>
    client.user.setActivity(activities[i++ % activities.length], {
      type: "PLAYING",
    }),
  30000
);
//login bot
client.login(process.env.token);
