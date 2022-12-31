import './App.css';

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const RSA = require('./utils/rsa')
const CryptoJS = require('crypto-js');
const socket = io('http://localhost:8000/');


function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState('')
  const [rsaKey, setRsaKey] = useState()
  const [desKeys, setDesKeys] = useState()


  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      const { e, n, d } = generateKey()
      const key = { e, n, d }
      setRsaKey(key)
      socket.emit('key', { e, n });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    if (rsaKey) {
      const { e, n, d } = rsaKey
      socket.emit('key', { e, n })
    }
  }, [rsaKey])


  useEffect(() => {
    socket.on('3keys', (DES_KEYS) => {
      if (rsaKey) {
        const { e, n, d } = rsaKey
        const { cK1, cK2, cK3 } = DES_KEYS
        const { decrypt } = RSA
        const keys = {
          k1: decrypt(cK1, d, n),
          k2: decrypt(cK2, d, n),
          k3: decrypt(cK3, d, n),
        }
        setDesKeys(keys)
      }
    })

    return () => {
      socket.off('3keys');
    };
  }, [rsaKey])


  const sendMessage = () => {
    const { encrypt: e } = CryptoJS.TripleDES
    const { k1, k2, k3 } = desKeys
    const k = k1.toString() + k2.toString() + k3.toString()
    const emsg = e(message, k).toString()
    socket.emit('encryptedMessage', emsg);
  }

  const generateKey = () => {
    const p = RSA.randomPrime(32)
    const q = RSA.randomPrime(32)

    return RSA.generate(64, p, q)
  }

  return (
    <div className="App">
      <p>Connected: {'' + isConnected}</p>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default App;
