import './App.css';

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000/');


function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState('')

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });


    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', message);
    console.log(message)
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
