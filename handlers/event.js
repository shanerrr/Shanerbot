const {readdirSync} = require("fs");

module.exports = (client) => {

    const load = dirs => {
        const events = readdirSync(`./events/${dirs}/`).filter(d => d.endsWith('.js'))
        for (let file of events) {
            const evt = require(`../events/${dirs}/${file}`)
            let fName = file.split('.')[0]
            client.on(fName, evt.bind(null, client))
            if (fName == "ready") {
                client.once("ready", () => {
                    client.manager.init(client.user.id);
                    console.log(`Logged in as ${client.user.tag}`);
                });
            }
        }
    }
    ["client", "guild"].forEach(x => load(x))


}