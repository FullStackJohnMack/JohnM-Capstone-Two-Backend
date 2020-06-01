/** Routes for adventures. */

const express = require("express");
const router = express.Router({ mergeParams: true });

const { adminRequired, authRequired } = require("../middleware/auth");

//Data validation for new and update adventure functions
const Adventure = require("../models/adventure");
const { validate } = require("jsonschema");
const { adventureNew, adventureUpdate } = require("../schemas");


/** GET all adventures route
 * Returns {adventures: [{adventure1},{adventure2},...]} or forwards error
 */

router.get("/", async function(req, res, next) {

  try {
    const adventures = await Adventure.findAll();
    return res.json({adventures});
  }

  catch (err) {
    return next(err);
  }
});


/** GET one adventure route
 * Given adventure_id as URL param, returns {adventure:{adventure}} or forwards error 
 */

router.get("/:adventure_id", async function(req, res, next) {
  try {
    const adventure = await Adventure.findOne(req.params.adventure_id);
    return res.json({adventure});
  }

  catch (err) {
    return next(err);
  }
});


/** POST route to create an adventure
 * Requires auth token
 * Given adventure data, returns {adventure} 
 */

router.post("/", authRequired, async function(req, res, next) {

      try {
        const validation = validate(req.body, adventureNew);

        //code block runs if new adventure doesn't validate against adventureNew schema
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


/** PATCH route to update an adventure
 * Requires admin status in auth token
 * Given adventure_id via URL param and adventure data, returns {adventure} or throws error */

router.patch("/:adventure_id", adminRequired, async function(req, res, next) {

  try {
    if ("adventure_id" in req.body) {
      return res.status(400).json({ message: "Not allowed" });
    }

    const validation = validate(req.body, adventureUpdate);

    //code block runs if updated adventure doesn't validate against adventureUpdate schema
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

/** DELETE route to delete adventure
 * Requires admin status in auth token
 * Given adventure_id via URL param, returns {message: "Adventure deleted"}  */

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