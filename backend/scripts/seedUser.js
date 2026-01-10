require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

mongoose.connect(process.env.MONGO_URI);

const seedUsers = async () => {
  await User.deleteMany();

  const users = [
    {
      name: 'Dokter Utama',
      username: 'doctor1',
      password: bcrypt.hashSync('123456', 10),
      role: 'doctor'
    },
    {
      name: 'Perawat 1',
      username: 'nurse1',
      password: bcrypt.hashSync('123456', 10),
      role: 'nurse'
    }
  ];

  await User.insertMany(users);
  console.log('Users seeded');
  process.exit();
};

seedUsers();
