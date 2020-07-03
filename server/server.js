require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();

const cors = require('cors');
const twitterRoutes = require('./twitterRoutes');

app.use(express.static('./../build'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cors());

app.use('/api/twitter', twitterRoutes);

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.all('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
