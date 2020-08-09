var flatfile = require('flat-file-db');
var db = flatfile('Rdb.db');
 
db.on('open', function() {
    //db.put('hello', "sjdksajdhsaldksakldjkasljdaskldjaksld");  // store some data
    //db.put('something is wrong hahahahahahahahahahahahahahahahahahahahah', "asdsjdksajdhsaldksakldjkasljdaskldjaksld");  // store some data
    console.log(db.keys());
    db.close();
});