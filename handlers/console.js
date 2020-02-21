module.exports = (client) => {
    let prompt = process.openStdin()
    prompt.addListener("data", res => {
        let x = res.toString().trim.split(/ +/g)
        client.channels.get("642174535755366400").send(x.join(" "));
    });

}