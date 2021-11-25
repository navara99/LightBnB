const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const query = `SELECT * FROM users WHERE email = $1;`;
  return pool.query(query, [email]).then((result) => result.rows[0]).catch((err) => err.message);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const query = `SELECT * FROM users WHERE id = $1;`;
  return pool.query(query, [id]).then((result) => result.rows[0]).catch((err) => err.message);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const { name, email, password } = user;
  const query = `INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;

  return pool.query(query, [name, email, password]).then((result) => result.rows[0]).catch((err) => err.message);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const query = `
  SELECT properties.* , reservations.* , AVG(property_reviews.rating) AS average_rating
  FROM properties
    JOIN reservations ON properties.id = reservations.property_id
    JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `;

  return pool.query(query, [guest_id, limit]).then((result) => result.rows).catch((err) => err.message);
};
exports.getAllReservations = getAllReservations;

const makeReservation = function (reservationDetails) {
  const details = ["start_date", "end_date", "property_id", "guest_id"];
  const values = details.map((key) => reservationDetails[key] ? reservationDetails[key] : null);
  const query = `
  INSERT INTO reservations
  (start_date, end_date, property_id, guest_id)
  VALUES
  ($1, $2, $3, $4)
  RETURNING *;
  `;

  return pool.query(query, values).then((result) => result.rows).catch((e) => e.message);
};
exports.makeReservation = makeReservation;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  const conditions = [];
  const { city, owner_id, minimum_price_per_night, maximum_price_per_night, minimum_rating } = options;

  // Initial query
  let query = `
  SELECT properties.* , AVG(property_reviews.rating) AS average_rating
  FROM properties JOIN property_reviews ON properties.id = property_reviews.property_id `;

  // Filter by city
  if (city) {
    queryParams.push(`%${city}%`);
    conditions.push(`city LIKE $${queryParams.length}`);
  }

  // Filter by owner_id
  if (owner_id) {
    queryParams.push(owner_id);
    conditions.push(`properties.owner_id = $${queryParams.length}`);
  }

  // Filter by min price
  if (minimum_price_per_night) {
    queryParams.push(100 * minimum_price_per_night);
    conditions.push(`cost_per_night >= $${queryParams.length}`);
  }

  // Filter by max price
  if (maximum_price_per_night) {
    queryParams.push(100 * maximum_price_per_night);
    conditions.push(`cost_per_night <= $${queryParams.length}`);
  }

  // Join the WHERE conditions
  if (conditions.length) {
    query += `WHERE ` + conditions.join(" AND ");
  }

  // Group by property id
  query += `GROUP BY properties.id `;

  // Add HAVING clause to filter by average rating
  if (minimum_rating) {
    queryParams.push(minimum_rating);
    query += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  // Order by the cost and limit the number of results
  queryParams.push(limit);
  query += `
  ORDER BY cost_per_night 
  LIMIT $${queryParams.length};`;

  return pool.query(query, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => err.message);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const keys = [
    "owner_id",
    "title",
    "description",
    "thumbnail_photo_url",
    "cover_photo_url",
    "cost_per_night",
    "parking_spaces",
    "number_of_bathrooms",
    "number_of_bedrooms",
    "country",
    "street",
    "city",
    "province",
    "post_code",
  ];

  const values = keys.map((column) => property[column] ? property[column] : null);
  const injectionId = keys.map((column, i) => `$${i + 1}`);

  const query = `
  INSERT INTO properties
  (
  owner_id, title, description, thumbnail_photo_url, cover_photo_url,
  cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms,
  country, street, city, province, post_code
  )
VALUES
  (${injectionId.join()})
  RETURNING *;
  `
  return pool.query(query, values).then((result) => result.rows).catch((err) => err.message);
};
exports.addProperty = addProperty;
