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
