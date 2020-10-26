module.exports = async (client, oldState, newState) => {
    if (newState.id == client.user.id && oldState.id == client.user.id && newState.channel == null){ 
        const player = client.manager.players.get(oldState.guild.id);
        if (player) player.destroy();
    }
}
