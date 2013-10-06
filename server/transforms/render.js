var stream = require('stream')
var util = require('util')
var View = require('../views/view')

var raw

var Render = function(json) {
  stream.Transform.call(this)
  this._writableState.objectMode = true

  raw = json
  
  // Ghetto Content Negotiation: Part 1
  this.view = (raw ?
    { items: [] } :
    new View
  )
}

util.inherits(Render, stream.Transform)

Render.prototype._transform = function(data, encoding, done) {
  // Ghetto Content Negotiation: Part 2
  if (raw) {
    this.view.items.push(data)
  }
  else {
    this.view.render(data)
  }
  done()
}

Render.prototype._flush = function(done) {
  // Ghetto Content Negotiation: Part 3
  if (raw) {
    this.push(JSON.stringify(this.view))
  }
  else {
    this.push(this.view.toString())
  }
  done()
}

module.exports = Render
