/** Functions for Adventure class, accessed by adventures routes. */

const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Adventure {


  /** Returns array of all adventures. */

  static async findAll() {

    let baseQuery = `
      SELECT adventure_id, name, description, adventure_categories.category, starting_location, ending_location, min_duration, max_duration, avg_duration, created_at, updated_at
        FROM adventures
        INNER JOIN adventure_categories ON adventures.category_id = adventure_categories.category_id;`

    const adventureRes = await db.query(baseQuery);

    return adventureRes.rows;
  }


  /** Given an adventure ID, returns one adventure or throws error if adventure can't be found. */

  static async findOne(adventure_id) {
    const adventureRes = await db.query(
        `SELECT adventure_id, name, description, adventure_categories.category, starting_location, ending_location, min_duration, max_duration, avg_duration, created_at, updated_at
            FROM adventures
            INNER JOIN adventure_categories ON adventures.category_id = adventure_categories.category_id
            WHERE adventure_id = $1`,
        [adventure_id]);

    const adventure = adventureRes.rows[0];

    if (!adventure) {
      const error = new Error(`There exists no adventure '${adventure_id}'`);
      error.status = 404;
      throw error;
    }

    return adventure;
  }


  /** Creates an adventure from user provided data and returns that adventure. */

  static async create(data) {
    const result = await db.query(
        `INSERT INTO adventures (name, description, category_id, starting_location, min_duration) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
        [data.name, data.description, data.category_id, data.starting_location, data.min_duration]
    );

    return result.rows[0];
  }


  /** Updates one adventure given the adaventure_id and new data or thorws error is adventure can't be found.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed adventure.
   *
   */

  static async update(adventure_id, data) {
    let {query, values} = sqlForPartialUpdate(
        "adventures",
        data,
        "adventure_id",
        adventure_id
    );

    const result = await db.query(query, values);
    const adventure = result.rows[0];

    if (!adventure) {
      let notFound = new Error(`There exists no adventure '${adventure_id}`);
      notFound.status = 404;
      throw notFound;
    }

    return adventure;
  }


  /** Deletes an adventure when given an adventure ID; returns undefined on success or throws error if can't find user. */

  static async remove(adventure_id) {
    const result = await db.query(
        `DELETE FROM adventures 
            WHERE adventure_id = $1 
            RETURNING adventure_id`,
        [adventure_id]);

    if (result.rows.length === 0) {
      let notFound = new Error(`There exists no adventure '${adventure_id}`);
      notFound.status = 404;
      throw notFound;
    }
  }
}

module.exports = Adventure;