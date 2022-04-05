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

let waitingList = [];
// let playerList = [];
let onlineList = [];
let person1;
let person2;
let playerName1;
let playerName2;

io.on('connection', (socket) => {
  console.log('connected', socket.id);

  socket.on('add-to-waiting', async (playerName) => {
    console.log('SERVER: add-to-waiting', socket.id, playerName);
    if(!waitingList.includes(socket)){
      waitingList.push({socket: socket, playerName: playerName});
      // playerList.push(playerName);
    }
    if(waitingList.length >= 2) {
      person1 = waitingList[0].socket;
      person2 = waitingList[1].socket;
      playerName1 = waitingList[0].playerName;
      playerName2 = waitingList[1].playerName;
      const people = util.randomSalties();
      const chosens = util.selectChosen(people);
      const roomId = uuidv4();
      person1.emit('chosen', chosens[0], chosens[1], 'active', { yourself: playerName1, opponent: playerName2 });
      person2.emit('chosen', chosens[1], chosens[0], 'inactive', { yourself: playerName2, opponent: playerName1 });
      person1.join(roomId);
      person2.join(roomId);
      io.to(roomId).emit('room-alert', roomId, people);
      waitingList = waitingList.filter(person => person.socket !== person1);
      waitingList = waitingList.filter(person => person.socket !== person2);
      // playerList = playerList.filter(person => person !== playerName1);
      // playerList = playerList.filter(person => person !== playerName2);
    }
    socket.on('win', (roomId, socketId) => {
      io.to(roomId).emit('return-win', socketId, roomId)
    })
    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      const clients = io.sockets.adapter.rooms.get(roomId);
      console.log('disconnected', socket.id);
      socket.disconnect(); // disconnecting the sockets that send this message, since the client
                           // will create a new one anyway.
    })
    socket.on('leave-waiting', () => {
      const newArr = waitingList.filter(player => player.socket !== socket);
      waitingList = [...newArr];
      console.log(waitingList, 'added new arr to waitinglist');
    })
    socket.on('change-turn', (roomId, name) => {
      io.to(roomId).emit('return-change-turn', socket.id, name)
    })
    socket.on('send-message', (roomId, userInput) => {
      const clients = io.sockets.adapter.rooms.get(roomId);
      io.to(roomId).emit('return-send-message', userInput, socket.id)
    })
    socket.on('question-answer', (message, answer, roomId) => {
      io.to(roomId).emit('return-question-answer', message, answer)
    })
    socket.on('print-question', (roomId, question) => {
      io.to(roomId).emit('return-print-question', question)
    })
    socket.on('add-online-list', (object) => {
      onlineList.push(object);
      console.log('added to online', onlineList);
    })
    socket.on('disconnecting', () => {
      onlineList = onlineList.filter(object => object.id !== socket.id);
      console.log('removed from online', onlineList)
      // const index = waitingList.indexOf(socket);
      const index = waitingList.findIndex(obj => {
        return obj.socket === socket;
      });

      if (index !== -1) {
        waitingList.splice(index, 1);
        // playerList = [...playerList].splice(index, 1);
      }
      const itterator = socket.rooms.values();
      const socketId = itterator.next().value;
      const roomId = itterator.next().value;
      io.to(roomId).emit('disconnect-alert', roomId);
    });
  });
});

app.get('/', async (req, res) => {
  res.send('server is running');
})

module.exports.app = app;

io.listen(server);
server.listen(process.env.PORT || 8000);