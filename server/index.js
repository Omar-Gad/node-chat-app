const express = require('express');
var cors = require('cors')
const http = require('http');
const { Server } = require("socket.io");
const RSA = require('./utils/rsa')
const bigInt = require('big-integer');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ debug: true, path: path.join(__dirname, './.env') });



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
  socket.on('key', (key) => {
    const DES_KEYS = {
      cK1: RSA.encrypt(bigInt(process.env.K1), key.e, key.n),
      cK2: RSA.encrypt(bigInt(process.env.K2), key.e, key.n),
      cK3: RSA.encrypt(bigInt(process.env.K3), key.e, key.n)
    }
    socket.emit('3keys', DES_KEYS)
  })

  socket.on('encryptedMessage', (encryptedMessage) => {
    const { decrypt: d } = CryptoJS.TripleDES
    const k = process.env.K1.toString() + process.env.K2.toString() + process.env.K3.toString()
    msg = d(encryptedMessage, k).toString(CryptoJS.enc.Utf8)
    console.log('encrypted message', encryptedMessage)
    console.log('decrypted message',msg)
  })
});

/* 
1 - create key pairs in client using RSA
2 - send public key to the server
3 - server encrypts 3 DES-keys using public key
4 - client decrypts the 3 DES-keys using private key
5 - encrypt and decrypt messages between the client and server using the 3 DES-keys
*/