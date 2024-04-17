// const app = require('express')()
// const http = require('http').createServer(app)

// app.get('/', (req, res) => { res.send("Node Server is running") })

// //Socket Logic
// const socketio = require('socket.io')(http)

// socketio.on("connection", (userSocket) => {
//     userSocket.on("send_message", (data) => {
//         userSocket.broadcast.emit("receive_message", data)
//     })
// })


const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat_message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat_message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
http.listen(process.env.PORT)
