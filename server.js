const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Ye 3 lines sab folders ki files dikhayengi - isi se auth.html khulega
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'backend')));
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Error:', err.message));

// User Schema
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' }
}));

// Home Route
app.get('/', (req, res) => {
  res.send('ShopNest Backend Running');
});

// Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const old = await User.findOne({ email });
    if (old) return res.json({ msg: 'Ye email pehle se hai' });
    const hashed = await bcrypt.hash(password, 10);
    const role = email === 'admin@shopnest.com' ? 'admin' : 'user';
    const user = new User({ name, email, password: hashed, role });
    await user.save();
    res.json({ msg: 'Signup Ho Gaya! Ab Login karo' });
  } catch (e) {
    res.json({ msg: 'Error: ' + e.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ msg: 'User nahi mila' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json({ msg: 'Password galat hai' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
    res.json({ msg: 'Login Ho Gaya', token, role: user.role, name: user.name });
  } catch (e) {
    res.json({ msg: 'Error: ' + e.message });
  }
});
app.get('/auth.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(5000, () => console.log('Server on 5000'));