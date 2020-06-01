/** Functions for User class, accessed by auth and users routes. */

const db = require("../db");
const bcrypt = require("bcrypt");
const partialUpdate = require("../helpers/partialUpdate");

//Based on early 2020 best practice
const BCRYPT_WORK_FACTOR = 15;

class User {

  //---------------FUNCTION CALLED BY AUTH ROUTE---------------

  /** Authenticates user with username, password. Returns single user object or throws err*/
  static async authenticate(data) {
    // finds user by provided username
    const result = await db.query(
        `SELECT username, 
                password, 
                first_name, 
                last_name, 
                email,
                is_admin
          FROM users 
          WHERE username = $1`,
        [data.username]
    );

    const user = result.rows[0];

    if (user) {
      // compare stored hashed password to a new hash from provided password
      const isValid = await bcrypt.compare(data.password, user.password);
      if (isValid) {
        return user;
      }
    }

    //if we don't have a valid user, throw error
    const invalidPass = new Error("Invalid Credentials");
    invalidPass.status = 401;
    throw invalidPass;
  }


//---------------FUNCTIONS CALLED BY USERS ROUTES---------------

  /** Registers user with data. On success, returns new user. */
  static async register(data) {
    const duplicateCheck = await db.query(
        `SELECT username 
            FROM users 
            WHERE username = $1`,
        [data.username]
    );

    //code block runs if duplicate username attempted
    if (duplicateCheck.rows[0]) {
      const err = new Error(
          `There already exists a user with username '${data.username}`);
      err.status = 409;
      throw err;
    }
    
    //hashes user provided password
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

    //writes user provided user data to database
    const result = await db.query(
        `INSERT INTO users 
            (username, password, first_name, last_name, email) 
          VALUES ($1, $2, $3, $4, $5) 
          RETURNING username, first_name, last_name, email, is_admin`,
        [
          data.username,
          hashedPassword,
          data.first_name,
          data.last_name,
          data.email
        ]);

    return result.rows[0];
  }


  /** Finds all users and returns array of user objects*/
  static async findAll() {
    const result = await db.query(
        `SELECT user_id, username, first_name, last_name, email, is_admin
          FROM users
          ORDER BY username`);

    return result.rows;
  }


  /** Accepts username and returns data about user or throws error if user can't be found. */
  static async findOne(username) {
    const userRes = await db.query(
        `SELECT user_id, username, first_name, last_name, email, is_admin
            FROM users 
            WHERE username = $1`,
        [username]);

    const user = userRes.rows[0];

    if (!user) {
      const error = new Error(`There exists no user '${username}'`);
      error.status = 404;
      throw error;
    }

    return user;
  }


  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed user.
   *
   * Throws error if user can't be found.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    let {query, values} = partialUpdate(
        "users",
        data,
        "username",
        username
    );

    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      let notFound = new Error(`There exists no user '${username}`);
      notFound.status = 404;
      throw notFound;
    }

    //remove auth related data from returned user data
    delete user.password;
    delete user.is_admin;

    return result.rows[0];
  }


  /** Delete given user from database; returns undefined on success or 404 error is user can't be found. */

  static async remove(username) {
    let result = await db.query(
      `DELETE FROM users 
      WHERE username = $1
      RETURNING username`,
      [username]);

    if (result.rows.length === 0) {
      let notFound = new Error(`There exists no user '${username}'`);
      notFound.status = 404;
      throw notFound;
    }
  }
}

module.exports = User;