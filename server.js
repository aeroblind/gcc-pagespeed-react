require('dotenv').config()
const path = require('path');
const express = require('express');

const port = process.env.PORT;

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('/dist/index.html'));
});


app.listen(port, () => {
  console.log(`${new Date().toString()}: App listening on port ${port}!`)
});