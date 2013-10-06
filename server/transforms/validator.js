var stream = require('stream')
var util = require('util')

var method, url, item

var Validator = function(request, id) {
  stream.Transform.call(this)

  method = request.method
  url = request.url
  item = id
}

util.inherits(Validator, stream.Transform)

Validator.prototype._transform = function(data, encoding, done) { 
  // You can only POST data, and only to
  // the list itself.
  if (!/post/i.test(method)) {
    this.emit('error', new Error, 405)
    return
  }

  this.push(data)
  done()
}

Validator.prototype._flush = function(done) {
  // Restrict allowed methods
  if (!/(get|post|delete)/i.test(method)) {
    this.emit('error', new Error, 405)
    return
  } 
  
  // If you're not requesting a list item or the
  // actual list, you may not pass this point.
  else if (!item && url !== '/') {
    this.emit('error', new Error)
    return
  }
  
  // If you're requesting an item but not
  // not trying to delete it, then you 
  // shall not pass either.
  else if (item && !/delete/i.test(method)) {
    this.emit('error', new Error, 405)
    return
  }

  done()
}

module.exports = Validator
