const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
//init commands
require("./handler")(client);
//init player
require("./player")(client);
//events
require("./events")(client);

let activities = [
    "your mom",
    "your gf",
    "your dad",
    "your bf",
    "depression",
    "your brother",
    "your friend",
  ],
  i = 0;
setInterval(
  () =>
    client.user.setActivity(activities[i++ % activities.length], {
      type: "PLAYING",
    }),
  30000
);

//login bot
client.login(token);
