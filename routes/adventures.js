/** Routes for jobs. */

const express = require("express");
const router = express.Router({ mergeParams: true });

const { adminRequired, authRequired } = require("../middleware/auth");

const Adventure = require("../models/adventure");
const { validate } = require("jsonschema");

const { adventureNew, adventureUpdate } = require("../schemas");


/** GET / => {jobs: [job, ...]} */

router.get("/", async function(req, res, next) {

  try {
    const adventures = await Adventure.findAll();
    return res.json({adventures});
  }

  catch (err) {
    return next(err);
  }
});

/** GET /[jobid] => {job: job} */

router.get("/:adventure_id", async function(req, res, next) {
  try {
    const adventure = await Adventure.findOne(req.params.adventure_id);
    return res.json({adventure});
  }

  catch (err) {
    return next(err);
  }
});

/** POST / {jobData} => {job: job} */

router.post(
    "/", authRequired, async function(req, res, next) {

      try {
        const validation = validate(req.body, adventureNew);

        if (!validation.valid) {
          return next({
            status: 400,
            message: validation.errors.map(e => e.stack)
          });
        }
        
        const adventure = await Adventure.create(req.body);
        return res.status(201).json(adventure);
      }

      catch (err) {
        return next(err);
      }
    }
);

/** PATCH /[jobid]  {jobData} => {job: updatedJob} */

router.patch("/:adventure_id", adminRequired, async function(req, res, next) {

  console.log(req.body);

  try {
    if ("adventure_id" in req.body) {
      return res.status(400).json({ message: "Not allowed" });
    }

    const validation = validate(req.body, adventureUpdate);
    if (!validation.valid) {
      return next({
        status: 400,
        message: validation.errors.map(e => e.stack)
      });
    }

    delete req.body.token; //no longer needed after middleware

    const adventure= await Adventure.update(req.params.adventure_id, req.body);
    return res.json(adventure);
  }

  catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  {message: "User deleted"}  */

router.delete("/:adventure_id", adminRequired, async function(req, res, next) {

  try {
    await Adventure.remove(req.params.adventure_id);
    return res.json({ message: "Adventure deleted" });
  }

  catch (err) {
    return next(err);
  }
});

module.exports = router;
