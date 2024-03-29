const { Pool } = require('pg');

// daki j'ai cree une connection vers le server ni n la bdd
// zemredh attkhedhmet manuellement avec l extension nni n sql tools n vscode
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'root'
});

module.exports = pool;
