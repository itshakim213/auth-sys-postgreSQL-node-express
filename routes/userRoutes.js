const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController')

const User = require('../models/userModel');

const router = express.Router();

router.get('/me', async (req, res) => {
  const user = req.user;
  res.send(await User.findById(user._id));
});

router.post('/v123/signup', registerUser);
router.post('/v123/signin', loginUser);


module.exports = router;