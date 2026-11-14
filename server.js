const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

let users = []; // abhi ke liye users yahi save honge

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: 'Sab fields bharo' });
  }
  let oldUser = users.find(u => u.email === email);
  if (oldUser) {
    return res.json({ success: false, message: 'Ye email pehle se hai' });
  }
  const hashed = await bcrypt.hash(password, 10);
  let newUser = { id: Date.now(), name, email, password: hashed };
  users.push(newUser);
  res.json({ success: true, message: 'Signup ho gaya! Ab Login karo' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  let user = users.find(u => u.email === email);
  if (!user) {
    return res.json({ success: false, message: 'User nahi mila, pehle Signup karo' });
  }
  let match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.json({ success: false, message: 'Password ghalat hai' });
  }
  let token = jwt.sign({ id: user.id }, 'secret123');
  res.json({ success: true, message: 'Login ho gaya!', token, name: user.name });
});

app.listen(5000, () => console.log('Server running on 5000'));