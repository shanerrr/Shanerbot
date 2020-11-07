module.exports = { 
    config: {
        name: "test",
        description: "i loop an active queue forever or stop a forever looping queue.",
        usage: "ur loopqueue",
        category: "music",
        accessableby: "Members",
        aliases: []
    },
    run: async (client, message, args) => {
            /**
     * Create a text progress bar
     * @param {Number} value - The value to fill the bar
     * @param {Number} maxValue - The max value of the bar
     * @param {Number} size - The bar size (in letters)
     * @return {String} - The bar
     */
    global.progressBar = (value, maxValue, size) => {
        const percentage = value / maxValue; // Calculate the percentage of the bar
        const progress = Math.round((size * percentage)); // Calculate the number of square caracters to fill the progress side.
        const emptyProgress = size - progress; // Calculate the number of dash caracters to fill the empty progress side.
    
        const progressText = '▇'.repeat(progress); // Repeat is creating a string with progress * caracters in it
        const emptyProgressText = '—'.repeat(emptyProgress); // Repeat is creating a string with empty progress * caracters in it
        const percentageText = Math.round(percentage * 100) + '%'; // Displaying the percentage of the bar
    
        const bar = '```[' + progressText + emptyProgressText + ']' + percentageText + '```'; // Creating the bar
        return bar;
    };

        const player = client.manager.players.get(message.guild.id);
        var progressbar = progressBar(player.position, player.queue.current.duration, 23);
        console.log(progressbar)

    }
}