const {DB_MONG} = require ("../botconfig.json");
const mongoose = require("mongoose");
module.exports = () => {
    console.log()
    mongoose.connect(
        DB_MONG,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          autoIndex: false,
          poolSize: 5,
          connectTimeoutMS: 10000,
          family: 4
        }, () => {
          console.log("Mongoose Is Connected");
        }
      );
      mongoose.set('useFindAndModify', false);
      mongoose.Promise = global.Promise;
}