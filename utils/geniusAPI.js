const { getLyrics, getSong } = require('genius-lyrics-api');
const { geniusAcessToken } = require('../config.json');

module.exports.getLyrics = async (title, artist) => {

  return getLyrics(
    {
      apiKey: geniusAcessToken,
      title: title,
      artist: artist,
      optimizeQuery: true
    }
  ).then((lyrics) => { return lyrics });
}

module.exports.getSongDetails = async (title, artist) => {

  console.log("TITLE:", title)
  console.log("ARTIST:", artist)
  let songDetails;
  await getSong(
    {
      apiKey: geniusAcessToken,
      title: title,
      artist: artist,
      // optimizeQuery: true
    }
  ).then((song) => { songDetails = song });

  return songDetails
}