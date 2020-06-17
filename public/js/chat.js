// calling io method to connect to the server
// socket will be used to fire and catch events and data
const socket = io();
const btn = document.getElementById("submitbtn");
const sendLoactionbtn = document.getElementById("sendLoaction");
const messagesEL = document.getElementById("messages");
const sideBar = document.getElementById("sideBar");

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//template
const messageTemplate = document.querySelector("#message-template").innerHTML;
const linkTemplate = document.querySelector("#link-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
const inputBox = document.getElementById("inputBox");

btn.addEventListener("click", () => {
  socket.emit("sendMessage", inputBox.value, (message) => {
    console.log("msg delivered!!");
    inputBox.value = "";
    inputBox.focus();
  });
});

sendLoactionbtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geoloaction is not supported by your browser");
  }
  sendLoactionbtn.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => sendLoactionbtn.removeAttribute("disabled")
    );
  });
});

socket.on("message", (msg) => {
  console.log(msg);
  const html = Mustache.render(messageTemplate, {
    message: msg.text,
    username: msg.username,
    createdAt: moment(msg.createdAt).format("h:m A"),
  });
  messagesEL.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (url) => {
  const html = Mustache.render(linkTemplate, {
    url: url.text,
    username: url.username,
    username,
    createdAt: moment(url.createdAt).format("h:m A"),
  });
  messagesEL.insertAdjacentHTML("beforeend", html);
});

socket.on("roomData", ({room, users}) => {
  console.log("users", users);
  console.log("in room - ", room);

  const html = Mustache.render(sidebarTemplate, {
    userCount: users.length,
    users,
    room,
  });

  sideBar.innerHTML = html;
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

// initial tests
// const btn = document.getElementById('incrementBtn');

// socket.on('countUpdate', (c) => {
//     console.log('Count has been updated!!', c)
// })

// btn.addEventListener('click', ()=>{
//     socket.emit('increment')
// })
