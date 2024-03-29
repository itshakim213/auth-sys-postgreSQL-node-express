const pool = require('./dbPool');

// waki juste pour avoir les data de la bdd
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

module.exports = { getClient };
