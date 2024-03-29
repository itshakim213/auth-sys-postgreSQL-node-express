const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;
const pool = require('./configs/dbPool');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');

pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL database');
    // client.query('SELECT * FROM users;', (err, res)=>(
    //     err ? console.log(err) : console.log(res.rows)
    // ));
    return client.query('SELECT * FROM users;')
      .then(res => {
        console.log('Query result:', res.rows);
      })
      .catch(err => {
        console.error('Error executing query:', err);
      })
      .finally(() => {
        client.release();
        console.log('Released client back to pool');
      });
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL database:', err);
  });
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
