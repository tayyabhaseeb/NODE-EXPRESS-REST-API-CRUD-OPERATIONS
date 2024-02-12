const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  // req and res are route handlers

  res.status(200).json({ message: 'Hello from the server', author: 'Tayyab' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// REST API ==> Representational state transfer
// use resources instead of verbs in api end points
// API should be stateless (means react state (same concept))
