;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var api = require('./models/api')
var Add = require('./views/add')
var List = require('./views/list')

var rendered = document.querySelector('.todos')
var list = new List(rendered)
var add = new Add

list.on('remove', function(id) {
  api.removeItem(id)
})

add.on('add', function(todo) {
  // Generate a temporary id
  var id = Math.floor(Math.random() * 1e8) 
  
  // Hear from the server
  var updateItem = function(error, response) {
    if (error) {
      console.error(error.message)
      return
    }

    var item = response.items.filter(function(item) {
      return item.text === todo
    })[0]

    if (item) {
      item.deletable = true
      list.updateItem(id, item)
    }
  }

  // Add the todo to the list
  list.addItem({
    _id: id,
    text: todo
  })

  // Tell the server
  api.addItem(todo, updateItem)
})

},{"./models/api":3,"./views/add":4,"./views/list":5}],2:[function(require,module,exports){
/**
 * asEvented v0.4.1 - an event emitter mixin which provides the observer pattern to JavaScript object.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/

var ArrayProto = Array.prototype;
var nativeIndexOf = ArrayProto.indexOf;
var slice = ArrayProto.slice;

function bind(event, fn) {
  var i, part;
  var events = this.events = this.events || {};
  var parts = event.split(/\s+/);
  var num = parts.length;

  for (i = 0; i < num; i++) {
    events[(part = parts[i])] = events[part] || [];
    events[part].push(fn);
  }
}

function one(event, fn) {
  // [notice] The value of fn and fn1 is not equivalent in the case of the following MSIE.
  // var fn = function fn1 () { alert(fn === fn1) } ie.<9 false
  var fnc = function () {
    fn.apply(this, slice.call(arguments));
    this.unbind(event, fnc);
  };
  this.bind(event, fnc);
}

function unbind(event, fn) {
  var eventName, i, index, num, parts;
  var events = this.events;

  if (!events) return;

  parts = event.split(/\s+/);
  for (i = 0, num = parts.length; i < num; i++) {
    if ((eventName = parts[i]) in events !== false) {
      index = (fn) ? _indexOf(events[eventName], fn) : 0;
      if (index !== -1) {
        events[eventName].splice(index, 1);
      }
    }
  }
}

function trigger(event) {
  var args, i;
  var events = this.events;

  if (!events || event in events === false) return;

  args = slice.call(arguments, 1);
  for (i = events[event].length - 1; i >= 0; i--) {
    events[event][i].apply(this, args);
  }
}

function _indexOf(array, needle) {
  var i, l;

  if (nativeIndexOf && array.indexOf === nativeIndexOf) {
    return array.indexOf(needle);
  }

  for (i = 0, l = array.length; i < l; i++) {
    if (array[i] === needle) {
      return i;
    }
  }
  return -1;
}

module.exports = function () {
  this.bind = this.on = bind;
  this.unbind = this.off = unbind;
  this.emit = trigger;
  this.one = one;
}

},{}],3:[function(require,module,exports){
var request = function(options) {
  var xhr = new XMLHttpRequest
  xhr.open(options.method, options.url, true)
  xhr.setRequestHeader('Accept', 'application/json')
  xhr.onerror = options.callback
  xhr.onload = function() {
    options.callback(null, JSON.parse(xhr.response))
  }
  if (options.data) {
    var type = 'x-www-form-urlencoded'
    xhr.setRequestHeader('Content-Type', type)
  }
  xhr.send(options.data) 
}

var noop = function() {}

module.exports = {
  addItem: function(todo, callback) {
    request({
      method: 'POST',
      url: '/',
      data: 'todo=' + encodeURIComponent(todo),
      callback: callback || noop
    })
  },
  removeItem: function(id, callback) {
    request({
      method: 'DELETE',
      url: '/' + id,
      callback: callback || noop
    }) 
  }
}

},{}],4:[function(require,module,exports){
var events = require('../lib/as-evented')

var click = ('ontouchstart' in document ? 'touchstart' : 'click')

var Add = function() {
  var header = document.querySelector('header')
  var button = document.createElement('button')
  
  button.textContent = 'Add'
  header.appendChild(button)

  button.addEventListener(click, this.add.bind(this))

  if (click === 'touchstart') {
    button.addEventListener('click', function(e) {
      e.preventDefault()
    })
  }
}

events.call(Add.prototype)

Add.prototype.add = function(e) {
  var todo = prompt('What do you need to do?')
  if (!todo || !todo.replace(/\s/g, '')) {
    return
  }  
  this.emit('add', todo)
}

module.exports = Add

},{"../lib/as-evented":2}],5:[function(require,module,exports){
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

},{"../../shared/list":8,"../lib/as-evented":2}],6:[function(require,module,exports){
module.exports = {
  prepend: function(target, element) {
    target.insertBefore(element, target.firstChild)
  },
  append: function(target, element) {
    target.appendChild(element)
  },
  before: function(target, element) {
    target.parentNode.insertBefore(element, target)
  },
  after: function(target, element) {
    if (target.nextElementSibling) {
      target.parentNode.insertBefore(element, target.nextElementSibiling)
    }
    else {
      target.parentNode.appendChild(element)
    }
  },
  insert: function(target, element) {
    target.innerHTML = ''
    target.appendChild(element)
  },
  set: function(type) {
    // DGAF, baby!
  }
}

},{}],7:[function(require,module,exports){
module.exports = function(html) {
  // Custom nodeName ‘cause we can.
  var dom = document.createElement('domify')
  dom.innerHTML = html
  
  // Return loose elements inside <domify> wrapper
  var children = dom.childNodes
  var elementCount = 0
  for (var i = 0, l = children.length; i < l; i++)
    if (children[i].nodeType == 3 && ++elementCount > 1)
      return dom
  
  // Return enclosed elements without <domify> wrapper
  return dom.firstChild
}

},{}],8:[function(require,module,exports){
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

},{"el":6,"mkdom":7}]},{},[1])
;