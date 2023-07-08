const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const path = require('path');


dotenv.config();
const app = express();
require('./db/Connection');


const port = process.env.PORT || 5000;


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(cookieParser());
app.use('/api/user/' , userRoutes);
app.use('/api/chat/' , chatRoutes);
app.use('/api/message/' , messageRoutes);

// ----------------------Deployment----------------------

// const __dirname1 = path.resolve();

// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static(path.join(__dirname1 , '../build')));
//     app.get('*' , (req , res) => {
//         res.sendFile(path.resolve(__dirname1 , 'build' , 'index.html'));
//     });
// }else{
//     app.get('/', (req, res) => {
//         res.send('Server is ready');
//     });
// }


// ----------------------Deployment----------------------


const server = app.listen(port, () => {
    console.log(`Backend started at localhost:${port}`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        //origin: "http://localhost:3000",
        origin: "https://chat-application-react-talk.netlify.app/"
    }
});

io.on('connection', (socket) => {
    console.log("connected to socket.io")

    socket.on('setup' , (userData) => {
        socket.join(userData._id);
        console.log("joined room " + userData._id);
        socket.emit('connected');
    });

    socket.on('join room' , (room) => {
        socket.join(room);
        console.log("joined room " + room);
    });

    socket.on('typing' , (room) => {
        socket.in(room).emit('typing');
    });

    socket.on('stop typing' , (room) => {
        socket.in(room).emit('stop typing');
    });

    socket.on('new message' , (newMessage) => {
        var chat = newMessage.chat;

        if(!chat.users) return console.log("Chat.users not defined");

        chat.users.forEach(user => {
            //send the live msg to all the users in the room excoet the sender
            if(user._id === newMessage.sender._id) return;
            socket.in(user._id).emit('message received' , newMessage);
        });
    });
});