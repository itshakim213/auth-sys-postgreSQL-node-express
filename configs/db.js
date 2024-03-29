const { Client } = require('pg');


const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'dbOne',
  user: 'itshakim',
  password: 'test123'
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
    // client.query('SELECT * FROM users;', (err, res)=>(
    //     err ? console.log(err) : console.log(res.rows)
    // ));
    client.query('SELECT * FROM users;')
      .then((res) => {
        console.log('Query result:', res.rows);
      })
      .catch((err) => {
        console.error('Error executing query:', err);
      })
      .finally(() => {
        client.end()
          .then(() => {
            console.log('Disconnected from PostgreSQL database');
          })
          .catch((err) => {
            console.error('Error closing client:', err);
          });
      });
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database:', err);
  });

