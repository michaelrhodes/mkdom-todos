var mkdom = require('mkdom')
var el = require('el')
var slice = Array.prototype.slice

var li = mkdom('<li></li>')

module.exports = function() {

  this.init = function(template, dom) {
    this.dom = dom || mkdom(template)
    this.handleEmptiness()
  }

  // Bind data to an item element
  this.bindData = function(item, data) {
    if (!item || !data) {
      return
    }
    if (data._id) {
      item.setAttribute('data-id', data._id)
    }
    if (data.text) {
      item.textContent = data.text
    }
    if (data.hasOwnProperty('deletable')) {
      item.className = data.deletable ? 'deletable' : ''
    }
  }

  this.addItem = function(data) {
    var item = li.cloneNode()
    this.bindData(item, data)
    el.append(this.dom, item)
    this.handleEmptiness()
  }

  this.updateItem = function(id, data) {
    var item = this.dom.querySelector(
      'li[data-id="' + id + '"]'
    ) 
    this.bindData(item, data)
  }

  this.updateAllItems = function(data) {
    var list = this
    var all = list.dom.querySelectorAll('li')
    slice.call(all).forEach(function(item) {
      list.bindData(item, data)
    })
  }

  this.removeItem = function(id) {
    var item = this.dom.querySelector(
      'li[data-id="' + id + '"]'
    ) 
    if (item) {
      this.dom.removeChild(item)
      this.handleEmptiness()
    }
  }

  this.handleEmptiness= function() {
    var empty = !this.dom.querySelector('li')
    var classes = ['todos']
    if (empty) {
      classes.push('empty')
    }
    this.dom.className = classes.join(' ')
  }

}
