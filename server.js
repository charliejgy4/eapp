const mongoose = require('mongoose');
const Msg = require('./models/messages');
const io = require('socket.io')(3000)
const mongoDB = "mongodb+srv://cj:1qaz2wsx@eapp.zgogg71.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('connected')
}).catch(err => console.log(err))
io.on('connection', (socket) => {
    Msg.find().then(result => {
        socket.emit('output-messages', result)
    })
    console.log('user connected');
    socket.emit('message', '');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chatmessage', msg => {
        const message = new Msg({ msg });
        message.save().then(() => {
            io.emit('message', msg)
        })


    })
});