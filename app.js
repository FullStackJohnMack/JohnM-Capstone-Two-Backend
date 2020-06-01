/** Express app which serves as the backend API for Adventure Montana.
 * Backend currently lives at https://adventure-montana-backend.herokuapp.com/
*/

const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());  //middleware to parse incoming requests with JSON data
app.use(cors());  //middleware which allows CORS

// middleware to log HTTP requests
const morgan = require("morgan");
app.use(morgan("tiny"));

const usersRoutes = require("./routes/users");
const adventuresRoutes = require("./routes/adventures");
const authRoutes = require("./routes/auth");

//defines routing paths for app
app.use("/users", usersRoutes);
app.use("/adventures", adventuresRoutes);
app.use("/", authRoutes);


/** 404 handler
 * Passes the 404 error to the next middleware
*/
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  
  return next(err);
});

/** general error handler
 * Returns an error and message
 */
app.use(function (err, req, res, next) {
  if (err.stack) console.log(err.stack);

  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;
