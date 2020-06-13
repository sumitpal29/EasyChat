// calling io method to connect to the server
// socket will be used to fire and catch events and data
const socket = io();
const btn = document.getElementById('submitbtn');
const sendLoactionbtn = document.getElementById('sendLoaction');
const messagesEL = document.getElementById('messages');

//template
const messageTemplate = document.querySelector('#message-template').innerHTML

const inputBox = document.getElementById('inputBox');
btn.addEventListener('click', ()=>{
    socket.emit('sendMessage', inputBox.value, (message)=>{
        console.log('msg delivered!!')
        inputBox.value = '';
        inputBox.focus()
    })
})
sendLoactionbtn.addEventListener('click', ()=>{
    if (!navigator.geolocation) {
        return alert('Geoloaction is not supported by your browser')
    }
    sendLoactionbtn.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('location is shared with connected clients')
            setTimeout(()=>{
                sendLoactionbtn.removeAttribute('disabled')
            }, 2000)
            
        })
    })
})

socket.on("message", (msg)=> {
    console.log(msg)
    const html  = Mustache.render(messageTemplate, {
        message: msg
    })
    messagesEL.insertAdjacentHTML('beforeend' , html)
})

// initial tests
// const btn = document.getElementById('incrementBtn');

// socket.on('countUpdate', (c) => {
//     console.log('Count has been updated!!', c)
// })

// btn.addEventListener('click', ()=>{
//     socket.emit('increment')
// })


