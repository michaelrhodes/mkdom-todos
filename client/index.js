var api = require('./models/api')
var Add = require('./views/add')
var List = require('./views/list')

var header = document.querySelector('header')
var rendered = document.querySelector('.todos')
var list = new List(rendered)
var add = new Add

header.appendChild(add.button)

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
