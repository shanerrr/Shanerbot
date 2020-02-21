
module.exports = async client => {
    console.log(`Logged in as ${client.user.username}!`);
    client.user.setActivity("ur help", {type: "WATCHING"});

    // let mstatus = [
    //     "pls invite me man",
    //     "haha hello",
    //     "ur help"
    // ]

    // setInterval(function() {
    //     let status = mstatus[Math.floor(Math.random() * mstatus.length)];
    //     client.user.setActivity(status, {type: "WATCHING"});
    // }, 200)
}