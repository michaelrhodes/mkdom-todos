var Base = require('./base')
var List = require('./list')
var el = require('el')

var View = function() {
  this.base = new Base
  this.list = new List
}

View.prototype.render = function(item) {
  this.list.addItem(item)
}

View.prototype.toString = function() {
  // Insert the list after the page header
  el.after(this.base.header, this.list.dom) 

  // Return HTML
  return this.base.toString().trim()
}

module.exports = View
