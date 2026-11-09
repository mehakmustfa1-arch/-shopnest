const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('ShopNest Backend Running... 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

