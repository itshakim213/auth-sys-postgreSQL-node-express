const asyncHandler = require('express-async-handler');
const pool = require('../configs/dbPool');
const bcrypt = require('bcryptjs');
const generateToken = require('../configs/generateToken');

const registerUser = asyncHandler(async (req, res) => {
  // les donnees de la req
  const { firstname, lastname, username, password } = req.body;

  // verrife mayella i3emred akk ayen ilaqen
  if (!firstname || !lastname || !username || !password) {
    res.status(400);
    throw new Error('Please enter all the required fields');
  }

  // je crypte le mdp
  const hashedPassword = await bcrypt.hash(password, 10);

  // j'ajoute l'utilisateur dans ma base de données
  const createUserQuery = {
    text: 'INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [firstname, lastname, username, hashedPassword]
  };

  try {
    // daki avec pool nni jaced ar les table de ma bdd pour creer une mayella ulach deja yiweth n la tabel
    const result = await pool.query(createUserQuery);
    const user = result.rows[0];

    // waki ayen aken d ittafichi postman its a javascript object notation normallement enfin de la repons n server
    res.status(201).json({
      _id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide both identifier and password');
  }

  // daki je verifie l existance n lutilisateru aki di la table users avec son username
  const findUserQuery = {
    text: 'SELECT * FROM users WHERE username = $1',
    values: [username]
  };

  try {
    const result = await pool.query(findUserQuery);
    const user = result.rows[0];

    
    // daki mayella ulach l utilisateur nni negh mdp faux amd yerr l err sinon le json nni ukessar
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid identifier or password' });
    } else {
      res.json({
        _id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        token: generateToken(user.id),
      });
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = { registerUser, loginUser };
