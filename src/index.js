const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { generateMsg } = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// io instance expected to be called with raw http server

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

// io.on to trigger a function when a perticalar event fires
// first param is event name and second one callback function
// when ever there is a new connection
io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("join", (opt, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      ...opt,
    });

    if (error) {
      return callback && callback(error);
    }
    // allows to join in a specific chat room
    socket.join(user.room);

    socket.emit("message", generateMsg("Admin", "Welcome User"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMsg("Admin", `${user.username} joined!!`));
    // io.to.emit emits events to every body but in a specific room
    // socket.brodcast.to(room).emit broadcasts event in specific room except current socket

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback && callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", generateMsg(user.username, message));
    callback && callback(message);
  });

  socket.on("sendLocation", (data, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateMsg(
        user.username,
        `https://google.com/maps?q=${data.latitude},${data.longitude}`
      )
    );
    callback && callback();
  });

  socket.on("disconnect", () => {
    const removedUser = removeUser(socket.id);
    if (removedUser) {
      io.to(removedUser.room).emit(
        "message",
        generateMsg("Admin", `${removedUser.username} has left!`)
      );
      io.to(removedUser.room).emit("roomData", {
        room: removedUser.room,
        users: getUsersInRoom(removedUser.room),
      });
    }
  });
});

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
