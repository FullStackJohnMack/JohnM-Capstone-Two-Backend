/** Shared config for application; can be req'd many places. */


// require("dotenv").config();

const SECRET = process.env.SECRET_KEY || 'test';

const PORT = +process.env.PORT || 3001;

// database is:
//
// - on Heroku, get from env var DATABASE_URL
// - in testing, 'adventure-test'
// - else: 'adventure'

let DB_URI;

DB_URI  = process.env.DATABASE_URL || 'adventure';


console.log("Using database", DB_URI);

module.exports = {
  SECRET,
  PORT,
  DB_URI,
};
