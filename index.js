const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(cors());

io.on('connection', (socket) => {
  console.log('connected');

  socket.on('get-log', async () => {
    socket.emit('return-log');
  });

  socket.on('update-log', async (data) => {
    chatlog.push(data);
    io.sockets.emit('return-log');
  });
});

app.get('/', async (req, res) => {
  res.send('server is running');
})

module.exports.app = app;

io.listen(server);
server.listen(process.env.PORT || 8000);