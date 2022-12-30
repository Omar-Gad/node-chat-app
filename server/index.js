const express = require('express');
var cors = require('cors')
const http = require('http');
const { Server } = require("socket.io");

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }))


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', }
});


app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(8000, () => {
  console.log('listening on http://localhost:8000');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message', (message) => {
    console.log(message)
  })
});

