const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})