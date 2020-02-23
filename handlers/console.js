module.exports = (client) => {
    let prompt = process.openStdin()
    prompt.addListener("data", res => {
        let x = res.toString().trim().split(/ +/g)
        client.channels.get("642791089115365396").send(x.join(" "));
    });

}