const pool = require('../configs/dbPool');
const bcrypt = require('bcryptjs');

const userTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
`;

pool.query(userTableQuery)
  .then(() => console.log('User table created successfully'))
  .catch(err => console.error('Error creating user table:', err.stack));

const createUser = async (firstname, lastname, username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const insertQuery = {
    text: 'INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)',
    values: [firstname, lastname, username, hashedPassword]
  };

  try {
    await pool.query(insertQuery);
    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error.stack);
  }
};

const getUserByUsername = async (username) => {
  const query = {
    text: 'SELECT * FROM users WHERE username = $1',
    values: [username]
  };

  try {
    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error('Error retrieving user:', error.stack);
    return null;
  }
};

module.exports = { createUser, getUserByUsername };
