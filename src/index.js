const path = require("path");
const http = require("http")
const express = require("express");
const socketio = require("socket.io")

const app = express();
const server = http.createServer(app)
const io = socketio(server)
// io instance expected to be called with raw http server

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));


// io.on to trigger a function when a perticalar event fires
// first param is event name and second one callback function
// when ever there is a new connection
io.on('connection', (socket) => {
    console.log('new connection')

    socket.emit("message", "welcome");
    socket.broadcast.emit("message", "A new user joined")
    socket.on("sendMessage", (message, callback) => {
        io.emit("message", message)
        callback && callback(message)
    })
    socket.on("sendLocation", (data, callback) => {
        socket.broadcast.emit("message", `https://google.com/maps?${data.latitude}${data.longitude}`)
        callback && callback()
    })

    socket.on('disconnect', () => {
        io.emit("message", "a user has left")
    })
})

server.listen(port, () => {
  console.log("Server started!!");
});

    // let count = 0;

    // for each new clients this method is going to fire.
    // lets send some data to the client by emmiting custom event
    // to send some data from server we will emit one method
    // we will listen it from client side
    // socket.emit('countUpdate', count)
    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdate', count);
    //     // for every single connection available
    //     io.emit('countUpdate', count);
    // })