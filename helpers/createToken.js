const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");


/** return signed JWT from user data. */

function createToken(user) {
  let payload = {
    username: user.username
  };

  return jwt.sign(payload, SECRET);
}


module.exports = createToken;