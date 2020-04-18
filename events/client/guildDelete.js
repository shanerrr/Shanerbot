module.exports = async (client, guild) => {
    client.music.players.destroy(guild.id);
}
