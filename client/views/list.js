var events = require('../lib/as-evented')
var shared = require('../../shared/list')

var click = ('ontouchend' in document ? 'touchend' : 'click')

var List = function(dom) {
  this.init(null, dom)
  this.updateAllItems({ deletable: true })
  
  this.dom.addEventListener(click, this.click.bind(this))
}

shared.call(List.prototype)
events.call(List.prototype)

List.prototype.click = function(e) {
  if (e.target.nodeName !== 'LI') {
    return
  }
  var id = e.target.getAttribute('data-id')
  this.removeItem(id)
  this.emit('remove', id)
}

module.exports = List
