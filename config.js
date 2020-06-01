/** Shared config for application*/

require("dotenv").config(); //loads for environmental variables

const SECRET = process.env.SECRET_KEY || 'local';

const PORT = +process.env.PORT || 3001;

//DB_URI will hold the name of our database
let DB_URI;

//in testing, use 'adventure-test' but in production, use database 'adventure' from env
DB_URI = process.env.DATABASE_URL || 'adventure-test';

console.log("Using database", DB_URI);

module.exports = {
  SECRET,
  PORT,
  DB_URI
};