var assert = require("assert");
var insertDocuments = function(db,table, callback) {
  // Get the documents collection
  var collection = db.collection(table);
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}
var indexCollection = function(db,table, callback) {
  db.collection(table).createIndex(
    { "a": 2 },
      null,
      function(err, results) {
        console.log(results);
        callback();
    }
  );
};
var findDocument = function(db,table,callback){
    var collection = db.collection(table);
    collection.find({}).toArray(function(err,docs){
        assert.equal(err,null);
        console.log("发现以下记录：");
        console.log(docs);
        callback(docs);
    });
}
var findDocuments = function(db,table,callback) {
   var cursor =db.collection(table).find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc !== null) {
        console.dir(doc);
      } else {
        callback();
      }
   });
};
module.exports.insertDocuments=insertDocuments;
module.exports.findDocument = findDocument;
module.exports.findDocuments = findDocuments;
module.exports.indexCollection = indexCollection;