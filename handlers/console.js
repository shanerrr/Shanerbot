module.exports = (client) => {
    let prompt = process.openStdin()
    prompt.addListener("data", res => {
        let x = res.toString().trim().split(/ +/g)
        client.channels.cache.get("642174295363158021").send(x.join(" "));
    });

}