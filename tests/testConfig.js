// npm packages
const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// app imports
const app = require("../app");
const db = require("../db");

// global auth variable to store things for all the tests
const TEST_DATA = {};

/**
 * Hooks to insert a user and adventure, and to authenticate
 *  the admin and general users for tokens that are stored
 *  in the input `testData` parameter.
 * @param {Object} TEST_DATA - build the TEST_DATA object
 */
async function beforeEachHook(TEST_DATA) {
  try {
    // login a user, get a token, store the username and token
    const hashedPassword = await bcrypt.hash("password", 1);
    await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, is_admin)
                  VALUES ('user', $1, 'tester', 'mctest', 'test1@rithmschool.com', false)`,
      [hashedPassword]
    );

    await db.query(
        `INSERT INTO users (username, password, first_name, last_name, email, is_admin)
                    VALUES ('admin', $1, 'tester', 'mctest', 'test2@rithmschool.com', true)`,
        [hashedPassword]
      );

    const responseUser = await request(app)
        .post("/login")
        .send({
            username: "user",
            password: "password",
      });

    const responseAdmin = await request(app)
        .post("/login")
        .send({
            username: "admin",
            password: "password",
    });

    TEST_DATA.userToken = responseUser.body.token;
    TEST_DATA.currentUsername = jwt.decode(TEST_DATA.userToken).username;

    TEST_DATA.adminToken = responseAdmin.body.token;
    TEST_DATA.adminUsername = jwt.decode(TEST_DATA.adminToken).username;

    const result = await db.query(
      "INSERT INTO adventures (name, description, category_id, starting_location, min_duration) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      ["Test Adventure", "Insert description here", 1, "100.0,-100.0", 60]
    );

    TEST_DATA.currentAdventure = result.rows[0];
  } catch (error) {
      console.error(error);
  }
}

async function afterEachHook() {
  try {
    await db.query("TRUNCATE adventures RESTART IDENTITY CASCADE");
    await db.query("TRUNCATE users RESTART IDENTITY CASCADE");
  } catch (error) {
    console.error(error);
  }
}

async function afterAllHook() {
  try {

    await db.end();
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  afterAllHook,
  afterEachHook,
  TEST_DATA,
  beforeEachHook,
};