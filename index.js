const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const app = express();
const server = http.createServer(app);
const util = require('./util');
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(cors());


const waitingList = [];

io.on('connection', (socket) => {
  console.log('connected');

  socket.on('add-to-waiting', async () => {
    waitingList.push(socket);
    if(waitingList.length >= 2) {
      const person1 = waitingList[0];
      const person2 = waitingList[1];
      const people = util.randomSalties();
      const chosens = util.selectChosen(people);
      const roomId = uuidv4();
      person1.join(roomId);
      person1.emit('chosen', chosens[0], chosens[1]);
      person2.emit('chosen', chosens[1], chosens[0]);
      person2.join(roomId);
      io.to(roomId).emit('room-alert', roomId, people);
      waitingList.shift();
      waitingList.shift();
    }
    socket.on('win', (data, roomId) => {
      io.to(roomId).emit('return-win', data)
    })
  });

  socket.on('update-log', async (data) => {
    io.sockets.emit('return-log');
  });
});

app.get('/', async (req, res) => {
  res.send('server is running');
})

module.exports.app = app;

io.listen(server);
server.listen(process.env.PORT || 8000);