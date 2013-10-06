var stream = require('stream')
var util = require('util')
var db

var List = function(datastore) {
  stream.Transform.call(this)
  this._readableState.objectMode = true

  db = datastore
}

util.inherits(List, stream.Transform)

List.prototype._transform = function(data, encoding, done) {
  done()
}

List.prototype._flush = function(done) {
  var list = this

  // Get all items
  db.find({}, function(error, items) {
    if (error) {
      list.emit('error', error.message, 500)
      return
    }
    // Return items in ascending order
    items.sort(function(a, b) {
      return a.timestamp - b.timestamp
    })
    .forEach(function(item) {
      list.push(item)
    })
    done()
  })
}

module.exports = List
