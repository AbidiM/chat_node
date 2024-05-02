'use strict';
const express = require('express');
const app = express();
const chatRoute = express.Router();
const http = require('http').Server(app);
const io = require('socket.io')(http);

chatRoute.use('/', function (req, res, next) {
    console.log('msg route working');
})

chatRoute.use('/chat', function (req, res, next) {

    console.log('chat route working');

    //rooms
    io.on('connection', socket => {
        //Get the chatID of the user and join in a room of the same chatID
        chatID = socket.handshake.query.chatID

        console.log('user ' + chatID + ' connected');
        socket.join(chatID)

        //Leave the room if the user closes the socket
        socket.on('disconnect', () => {

            console.log('user ' + chatID + ' disconnected');
            socket.leave(chatID)
        })

        //Send message to only a particular user
        socket.on('send_message', message => {


            msg = JSON.parse(message);


            console.log(msg);
            console.log(msg.receiverChatID);
            console.log(msg.senderChatID);
            console.log(msg.content);

            receiverChatID = msg.receiverChatID
            senderChatID = msg.senderChatID
            content = msg.content

            console.log('user ' + senderChatID + ' sent to ' + receiverChatID + "\n" + content);
            //Send message to only that particular room
            socket.in(receiverChatID).emit('receive_message', {
                'content': content,
                'senderChatID': senderChatID,
                'receiverChatID': receiverChatID,
            })
        })
    });

    http.listen(process.env.PORT)
});


module.exports = chatRoute;