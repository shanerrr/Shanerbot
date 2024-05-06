module.exports.getProviderDetails = function (queryType) {
  const providerNames = {
    spotifySong: "Spotify",
    appleMusicSong: "Apple Music",
  };

  const providersIcons = {
    spotifySong:
      "https://assets.stickpng.com/images/5ece5029123d6d0004ce5f8b.png",
    appleMusicSong:
      "https://assets.stickpng.com/images/60394f92b6264f0004079c19.png",
  };

  return [providerNames[queryType], providersIcons[queryType]];
};
