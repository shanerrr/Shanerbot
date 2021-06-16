const { getSong } = require('genius-lyrics-api');
const { geniusAcessToken } = require('../config.json');
const axios = require('axios');

module.exports.getLyrics = async (title) => {
  const options = {
    apiKey: geniusAcessToken,
    title: title,
    artist: '',
    optimizeQuery: true
  };
  return await getSong(options);
}

// https://api.genius.com/referents?song_id=239378&access_token={token}
module.exports.otherDetails = async (id) => {
  return await axios.get(`https://api.genius.com/referents?song_id=${id}&access_token=${geniusAcessToken}`);
}