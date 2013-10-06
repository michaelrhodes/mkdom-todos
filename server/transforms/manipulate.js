var stream = require('stream')
var util = require('util')
var qs = require('querystring')

var method, url, db, item

var Manipulate = function(request, datastore, id) {
  stream.Transform.call(this)
  this._readableState.objectMode = true

  method = request.method
  url = request.url
  db = datastore
  item = id
}

util.inherits(Manipulate, stream.Transform)

Manipulate.prototype._transform = function(data, encoding, done) {
  var manipulate = this
  var parsed = qs.parse(data.toString())

  if (!parsed.todo) {
    manipulate.emit('error', new Error('No todo found'))
    return
  }

  var data = {
    text: parsed.todo.trim(),
    timestamp: +new Date
  }

  db.insert(data, function(error, item) {
    if (error) {
      manipulate.emit('error', error, 500)
      return
    }
    done()
  })
}

Manipulate.prototype._flush = function(done) {
  var manipulate = this

  // Allow posts and gets to pass through.
  if (!/delete/i.test(method)) {
    done()
    return
  }

  if (item) {
    db.remove({ _id: item }, function(error, affected) {
      if (error || !affected) {
        manipulate.emit('error', error || new Error('No todo found'), 404)
        return
      }
      done()
    })
  }
  else {
    db.remove({}, function(error) {
      if (error) {
        manipulate.emit('error', error, 500)
        return 
      }
      done()
    }) 
  }
}

module.exports = Manipulate
