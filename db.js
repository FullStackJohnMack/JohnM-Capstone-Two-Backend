/** Database setup for Adventure Montana. */

const { Client } = require("pg"); //uses PosgresQL
const { DB_URI } = require("./config");

const client = new Client({
  connectionString: DB_URI
});

client.connect();

module.exports = client;