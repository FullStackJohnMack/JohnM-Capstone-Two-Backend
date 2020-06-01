/** Middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const {SECRET} = require("../config");


/** Middleware to use when a valid token is required to access routes.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not successful, throws 401 Unauthorized error.
 *
 */

function authRequired(req, res, next) {

  try {
    const tokenStr = req.body.token || req.query.token; //looks for token on request body and as a query parameter
    let token = jwt.verify(tokenStr, SECRET);
    req.username = token.username;
    return next();
  }

  catch (err) {
    let unauthorized = new Error("You must authenticate first.");
    unauthorized.status = 401;  // 401 Unauthorized
    return next(unauthorized);
  }
}


/** Middleware to use when user is admin and has token showing that.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If user is not an admin, a 401 Unauthorized error is thrown.
 *
 */

function adminRequired(req, res, next) {

  try {
    const tokenStr = req.body.token;

    let token = jwt.verify(tokenStr, SECRET);
    req.username = token.username;

    if (token.is_admin) {
      return next();
    }

    // is user not admin, throw error to be caught later in catch block
    throw new Error();
  }

  catch (err) {
    const unauthorized = new Error("You must be an admin to access.");
    unauthorized.status = 401;

    return next(unauthorized);
  }
}


/** Middleware to use when user must provide a valid token & matching username provided as route param.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If user is not the correct user, throw 401 Unauthorized error.
 */

function ensureCorrectUser(req, res, next) {

  try {
    const tokenStr = req.body.token || req.query.token;

    let token = jwt.verify(tokenStr, SECRET);
    req.username = token.username;

    if (token.username === req.params.username) {
      return next();
    }

    // throw an error, so we catch it in our catch, below
    throw new Error();
  }

  catch (e) {
    const unauthorized = new Error("You are not authorized.");
    unauthorized.status = 401;

    return next(unauthorized);
  }
}


module.exports = {
  authRequired,
  adminRequired,
  ensureCorrectUser
};
