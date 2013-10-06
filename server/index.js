var http = require('http')
var Datastore = require('nedb')
var ecstatic = require('ecstatic')

var Validator = require('./transforms/validator')
var Manipulate = require('./transforms/manipulate')
var List = require('./transforms/list')
var Render = require('./transforms/render')

var files = ecstatic({
  handleError: false,
  root: './client/public',
  gzip: true
})

var db = new Datastore({
  filename: __dirname + '/items.db',
  autoload: true
})

http.createServer(function(request, response) {
  var fail = function(error, code) {
    response.statusCode = code || 500
    response.end(error.message + '\n')
  }

  // The request is for an individual list item.
  // The one liner returns eiter the id or undefined.
  var id = (request.url.match(/^\/([a-z0-9]{16})$/i) || []).slice(1)[0]

  // Ghetto Content Negotiation: Part 1
  var json = /json/.test(request.headers.accept)

  // Initialise tranforms
  var validate = new Validator(request, id)
  var manipulate = new Manipulate(request, db, id)
  var list = new List(db)
  var render = new Render(json)

  // If a request isn't for the list (/) then
  // attempt to server static files before
  // returing a 404.
  validate.on('error', function(error) {
    files(request, response, function() {
      fail(error, 404)
    })
  })

  // Kill the response if something
  // goes horribly wrong.
  manipulate.on('error', fail)
  list.on('error', fail)
  render.on('error', fail)

  // If we get to, and finish, the render step
  // then we can safely respond with an 'OK'.
  render.on('end', function() {
    response.statusCode = 200 
  })

  // Ghetto Content Negotiation: Part 2
  response.setHeader(
    'Content-Type', (json ?
      'application/json; charset=utf-8' :
      'text/html; charset=utf-8'
    )
  )

  // Strea|a|a|a|a|ms
  request
    .pipe(validate)
    .pipe(manipulate)
    .pipe(list)
    .pipe(render)
    .pipe(response)
})

.listen(process.argv[2], function() {
  console.log('Listening on ' + this.address().port)
})
