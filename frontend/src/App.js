import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000')
      .then(res => setMessage(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <h1>{message || "Loading..."}</h1>
    </div>
  );
}

export default App;
