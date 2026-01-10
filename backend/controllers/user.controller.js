const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name _id');
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'Username exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, username, password: hashedPassword, role });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addNurse = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ success: false, message: 'Mohon lengkapi semua data' });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nurse = await User.create({
      name,
      username,
      password: hashedPassword,
      role: 'nurse' 
    });

    res.status(201).json({
      success: true,
      message: 'Staff perawat berhasil ditambahkan',
      data: {
        _id: nurse._id,
        name: nurse.name,
        username: nurse.username,
        role: nurse.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { name, password, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    if (name) {
      user.name = name;
    }

    if (newPassword) {
      if (!password) {
        return res.status(400).json({ message: 'Masukkan password lama untuk konfirmasi' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Password lama salah' });
      } 

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile berhasil diperbarui',
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getNurses = async (req, res) => {
  try {
    const nurses = await User.find({ role: 'nurse' }).select('-password');
    res.status(200).json({ success: true, data: nurses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    user.name = name || user.name;
    user.username = username || user.username;

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Data staff berhasil diperbarui',
      data: user
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Staff berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};