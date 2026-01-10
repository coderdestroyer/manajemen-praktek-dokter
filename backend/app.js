const express = require('express');
const cors = require("cors");
const app = express();

app.use(cors());

// global middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.get('/', (req, res) => {
  res.json({ mssg: 'Welcome to the App' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/patient', require('./routes/patient.routes'));
app.use('/api/visit', require('./routes/visit.routes'));
app.use('/api/user', require('./routes/user.routes'));

module.exports = app;
