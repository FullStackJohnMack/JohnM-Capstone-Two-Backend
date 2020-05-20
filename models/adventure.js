const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");


/** Related functions for companies. */

class Adventure {

  /** Find all jobs (can filter on terms in data). */

  static async findAll() {
//   static async findAll(data, username) {
    let baseQuery = `
      SELECT adventure_id, name, description, adventure_categories.category, starting_location, ending_location, min_duration, max_duration, avg_duration, created_at, modified_at
        FROM adventures
        INNER JOIN adventure_categories ON adventures.category_id = adventure_categories.category_id;`
    // let whereExpressions = [];
    // let queryValues = [username];

    // For each possible search term, add to whereExpressions and
    // queryValues so we can generate the right SQL

    // if (data.min_salary) {
    //   queryValues.push(+data.min_employees);
    //   whereExpressions.push(`min_salary >= $${queryValues.length}`);
    // }

    // if (data.max_equity) {
    //   queryValues.push(+data.max_employees);
    //   whereExpressions.push(`min_equity >= $${queryValues.length}`);
    // }

    // if (data.search) {
    //   queryValues.push(`%${data.search}%`);
    //   whereExpressions.push(`title ILIKE $${queryValues.length}`);
    // }

    // if (whereExpressions.length > 0) {
    //   baseQuery += " WHERE ";
    // }

    // Finalize query and return results

    // let finalQuery = baseQuery + whereExpressions.join(" AND ");
    const adventureRes = await db.query(baseQuery);
    // const jobsRes = await db.query(finalQuery, queryValues);
    return adventureRes.rows;
  }

  /** Given a job id, return data about job. */

  static async findOne(adventure_id) {
    const adventureRes = await db.query(
        `SELECT adventure_id, name, description, adventure_categories.category, starting_location, ending_location, min_duration, max_duration, avg_duration, created_at, modified_at
            FROM adventures
            INNER JOIN adventure_categories ON adventures.category_id = adventure_categories.category_id
            WHERE adventure_id = $1`,
        [adventure_id]);

    const adventure = adventureRes.rows[0];

    if (!adventure) {
      const error = new Error(`There exists no adventure '${adventure_id}'`);
      error.status = 404;   // 404 NOT FOUND
      throw error;
    }

    // const companiesRes = await db.query(
    //     `SELECT name, num_employees, description, logo_url 
    //       FROM companies 
    //       WHERE handle = $1`,
    //     [job.company_handle]
    // );

    // job.company = companiesRes.rows[0];

    return adventure;
  }

  /** Create a job (from data), update db, return new job data. */

  static async create(data) {
    const result = await db.query(
        `INSERT INTO adventures (name, description, category_id, starting_location, min_duration) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING name`,
        [data.name, data.description, data.category_id, data.starting_location, data.min_duration]
    );

    return result.rows[0];
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed job.
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

  /** Delete given job from database; returns undefined. */

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

// {
// 	"name": "Test Adventure",
// 	"description": "Really crazy cool.",
// 	"category_id": 1,
// 	"starting_location": "47.846278, -112.782389",
// 	"min_duration": 30
// }