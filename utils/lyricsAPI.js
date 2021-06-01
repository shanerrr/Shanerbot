const lyricsFinder = require('lyrics-finder');

module.exports.getLyrics = async (title, artist) => {
  return await lyricsFinder(artist, title);
}