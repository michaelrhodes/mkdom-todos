# todos: a mkdom example
This is just a basic todo app that demonstrates how you can use mkdom to share rendering logic between the browser and the server.

## install
```sh
# Clone this repo or download the zip if you don’t use git.
git clone git@github.com:michaelrhodes/mkdom-todos.git
cd mkdom-todos

# Install the project dependencies & run the server.
npm install && npm start
```

The application should now be running at localhost:8888. Edit scripts.start in the example/package.json file if you need to run on a different port.

## usage
Add some todos and then try disabling Javascript. You won’t be able to edit the list, but you’ll still be able to see existing items. It would be pretty trivial to get the add/remove functionality working without Javascript (the server design is pretty RESTful), but the current implementation at least shows *some* progressive enhancement.
