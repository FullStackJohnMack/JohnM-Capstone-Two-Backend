/** Routes for users. */

const express = require("express");
const router = express.Router();

const { authRequired, ensureCorrectUser } = require("../middleware/auth");

const User = require("../models/user");
const { validate } = require("jsonschema");

const { userNew, userUpdate } = require("../schemas");

const createToken = require("../helpers/createToken");

/** GET / => {users: [user, ...]} */

router.get("/", authRequired, async function(req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => {user: user} */

router.get("/:username", authRequired, async function(req, res, next) {
  try {
    const user = await User.findOne(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** POST / {userdata}  => {token: token} */

router.post("/", async function(req, res, next) {
  
  try {
    delete req.body._token;
    const validation = validate(req.body, userNew);

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

/** PATCH /[handle] {userData} => {user: updatedUser} */

router.patch("/:username", ensureCorrectUser, async function(req, res, next) {
  try {
    if ("username" in req.body || "is_admin" in req.body) { //disallows username or is_admin to be changed
      return next({ status: 400, message: "Not allowed" });
    }

    await User.authenticate({
      username: req.params.username,
      password: req.body.password
    });
    delete req.body.password;
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

/** DELETE /[handle]  =>  {message: "User deleted"}  */

router.delete("/:username", ensureCorrectUser, async function(req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ message: "User deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
