const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/user');
const auth = require('./middleware/auth'); // Import the auth middleware


// Set up environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://mohamedabidi:G25uLQMzh18fiKA0@slcluster.opmphm7.mongodb.net/?retryWrites=true&w=majority&appName=SLCluster';
const SECRET_KEY = '9f45e9d85c0c552ce01aeebd9db0da30918f941ea2381e758fc1f49254a033e0';

// Initialize the app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect(MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send('Error registering user');
    console.log(error);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, username: user.username, userId: user._id });
  } catch (error) {
    res.status(500).send('Error logging in user');
  }
});

app.put('/user', auth, async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('No token, authorization denied');

    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    const { username, email, password } = req.body;
    const updatedData = {};
    if (username) updatedData.username = username;
    if (email) updatedData.email = email;
    if (password) updatedData.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).send('Error updating user');
  }
});

app.delete('/user', auth, async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('No token, authorization denied');

    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    await User.findByIdAndDelete(userId);
    res.send('User deleted');
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
});

app.get('/user', auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (error) {
    res.status(500).send('Error fetching user');
  }
});

// In-memory storage for connected users
const users = {};

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (username) => {
    users[username] = socket.id;
  });

  socket.on('sendPrivateMessage', ({ recipient, message }) => {
    const recipientSocketId = users[recipient];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newPrivateMessage', {
        sender: socket.id,
        message,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    for (const [username, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[username];
        break;
      }
    }
  });
});

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
















// const express = require('express');
// const app = express();
// const http = require('http');

// const server = http.createServer(app);

// app.use(express.json());

// const chat = require('./routes/chat');
// const writeRead = require('./routes/writeRead');
// const updateDelete = require('./routes/updateDelete');

// app.use('/cr', writeRead);
// app.use('/ud', updateDelete);
// app.use('/msg', chat);
// app.use('/', function (req, res, next) {
    
//     console.log('api working');
//     res.sendStatus(404);
// });



// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// // app.listen(PORT, () =>
// //     console.log('Server running on port: ' + PORT
// //     ));



// // const app = require('express')();
// // const http = require('http').Server(app);
// // const io = require('socket.io')(http);


// // //rooms
// // io.on('connection', socket => {
// //     //Get the chatID of the user and join in a room of the same chatID
// //     chatID = socket.handshake.query.chatID

// //     console.log('user ' + chatID + ' connected');
// //     socket.join(chatID)

// //     //Leave the room if the user closes the socket
// //     socket.on('disconnect', () => {

// //         console.log('user ' + chatID + ' disconnected');
// //         socket.leave(chatID)
// //     })

// //     //Send message to only a particular user
// //     socket.on('send_message', message => {


// //         msg = JSON.parse(message);


// //         console.log(msg);
// //         console.log(msg.receiverChatID);
// //         console.log(msg.senderChatID);
// //         console.log(msg.content);

// //         receiverChatID = msg.receiverChatID
// //         senderChatID = msg.senderChatID
// //         content = msg.content

// //         console.log('user ' + senderChatID + ' sent to ' + receiverChatID + "\n" + content);
// //         //Send message to only that particular room
// //         socket.in(receiverChatID).emit('receive_message', {
// //             'content': content,
// //             'senderChatID': senderChatID,
// //             'receiverChatID': receiverChatID,
// //         })
// //     })
// // });

// // http.listen(process.env.PORT)