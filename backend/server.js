// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Telemedicine API Running');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
