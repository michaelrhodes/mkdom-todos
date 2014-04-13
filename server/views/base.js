var fs = require('fs')
var mkdom = require('mkdom')

var Base = function() {
  var template = fs.readFileSync(__dirname + '/template.html', 'utf8')
  this.dom = mkdom(template)
  this.body = this.dom.querySelector('body') 
  this.header = this.dom.querySelector('header') 
}

Base.prototype.toString = function() { 
  return this.dom.doctype + this.dom.outerHTML
}

module.exports = Base
