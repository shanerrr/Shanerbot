module.exports = { 
    config: {
        name: "report",
        description: "Report any bugs/issues with this bot",
        usage: "ur report <details on issue/bug>",
        category: "ShanerBot",
        accessableby: "Administrator",
        aliases: ["fix", "bug"]
    },
    run: async (client, message, args) => {
        return message.react("❌");
    //     //client.report.clear();
    //     //console.log(client.report.keys())
    //     if (args.join(" ").length < 30) {
    //         message.react("❌");
    //         client.reportcooldown.delete(message.author.id)
    //         return message.channel.send("`Please provide a more detailed explanation of the issue/bug.`").then(msg => msg.delete({timeout: 5000}));
    //     }
    //     if (client.report.has(args.join(" "))){
    //         return message.react("❌");
    //     }
    //     //client.report.put(message.guild.id, args.join(" "));
    //     client.report.put(args.join(" "), message.guild.id);
    //     //console.log(client.report.get("642174295363158018"));
    //     return message.react("✅");
    }
  }
  
  