const express = require('express');
var cors = require('cors')
const http = require('http');
const { Server } = require("socket.io");
const RSA = require('./utils/rsa')

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }))


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', }
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

(() => {
  const msg = 'hello world'
  const p = RSA.randomPrime(32)
  const q = RSA.randomPrime(32)

  const encoded = Buffer.from(msg).toString('hex');
  const decoded = Buffer.from(encoded, 'hex').toString();

  const key = RSA.generate(64, p, q)
  // const encodedMsg = RSA.encode(msg)
  const C = RSA.encrypt(9, key.e, key.n)
  const M = RSA.decrypt(C, key.d, key.n)
  // const decodedMsg = RSA.decode(M)

  console.log('msg', decodedMsg)

})();

/* 
1 - create key pairs in client using RSA
2 - send public key to the server
3 - server encrypts 3 DES-keys using public key
4 - client decrypts the 3 DES-keys using private key
5 - encrypt and decrypt messages between the client and server using the 3 DES-keys
*/