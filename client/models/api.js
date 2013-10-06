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
