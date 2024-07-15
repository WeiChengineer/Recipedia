const pkg = require("pg");
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Recipedia",
  password: "admin",
  port: 5432,
});

module.exports = pool;
