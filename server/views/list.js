var fs = require('fs')
var shared = require('../../shared/list')

var List = function() {
  var template = fs.readFileSync('./shared/list.html', 'utf8')
  this.init(template)
}

shared.call(List.prototype)

module.exports = List
