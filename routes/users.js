/** Routes for users. */

const express = require("express");
const router = express.Router();

const { authRequired, ensureCorrectUser } = require("../middleware/auth");

//Data validation for new and update user functions
const User = require("../models/user");
const { validate } = require("jsonschema");
const { userNew, userUpdate } = require("../schemas");

const createToken = require("../helpers/createToken");


/** GET all users route
 * Requires auth token
 * Returns {users: [{user1}, {user2},...]} or forwards error
 */

router.get("/", authRequired, async function(res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
      return next(err);
  }
});


/** GET one user route
 * Requires auth token
 * Given username as URL param, returns {user: {user}} or forwards error 
 */

router.get("/:username", authRequired, async function(req, res, next) {
  try {
    const user = await User.findOne(req.params.username);
    return res.json({ user });
  } catch (err) {
      return next(err);
  }
});


/** POST route to create a user
 * Given {userdata}, returns {username, token} or forwards error
 */

router.post("/", async function(req, res, next) {
  try {
    delete req.body.token; //removes token from request as not necessary here
    const validation = validate(req.body, userNew); //validates new user data against schema

    //code block runs if user data doesn't meet schema requirements
    if (!validation.valid) {
      return next({
        status: 400,
        message: validation.errors.map(e => e.stack)
      });
    }

    const newUser = await User.register(req.body);
    const token = createToken(newUser);
    return res.status(201).json({ username:newUser.username, token });
  } catch (e) {
      return next(e);
  }
});


/** PATCH route to update a user
 * Requires auth token verifiying patching user is patched user
 * Given a username (as URL param) and user data as request data, returns {user: {updatedUser}} or forwards error
 */

router.patch("/:username", ensureCorrectUser, async function(req, res, next) {
  try {
    //this block throws error if user passes a username or is_admin data... this data should not be changable at this point in the app
    if ("username" in req.body || "is_admin" in req.body) {
      return next({ status: 400, message: "Can't change username or admin status" });
    }

    await User.authenticate({
      username: req.params.username,
      password: req.body.password
    });

    delete req.body.password; //removes password from request body as no longer needed after authentication
    
    //this code block validates updated user data against schema
    const validation = validate(req.body, userUpdate);
    if (!validation.valid) {
      return next({
        status: 400,
        message: validation.errors.map(e => e.stack)
      });
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
      return next(err);
  }
});


/** DELETE route to delete a user
 * Given a username as URL param, returns {message: "User deleted"} on success or forwards error on failure
 */

router.delete("/:username", ensureCorrectUser, async function(req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ message: "User deleted" });
  } catch (err) {
      return next(err);
  }
});

module.exports = router;
