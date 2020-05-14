module.exports = async (client, oldState, newState) => {
    if (newState.id == client.user.id && oldState.id == client.user.id && newState.channel == null){ 
        const player = client.music.players.get(oldState.guild.id);
        if (player) client.music.players.destroy(oldState.guild.id);
    }
}
