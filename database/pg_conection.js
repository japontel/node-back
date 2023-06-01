const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'hello-world_postgres_1',
  database: 'db',
  password: 'pass',
  port: 5432,
});

module.exports = pool;