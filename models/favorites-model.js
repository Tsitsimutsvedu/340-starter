const pool = require("../database/");

/* ***************************************
 * Add a favorite for a user
 ****************************************/
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2)
      ON CONFLICT (account_id, inv_id) DO NOTHING
      RETURNING favorite_id;
    `;
    const result = await pool.query(sql, [account_id, inv_id]);
    return result;
  } catch (error) {
    throw error;
  }
}

/* ***************************************
 * Remove a favorite for a user
 ****************************************/
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `
      DELETE FROM favorites
      WHERE account_id = $1 AND inv_id = $2;
    `;
    const result = await pool.query(sql, [account_id, inv_id]);
    return result;
  } catch (error) {
    throw error;
  }
}

/* ***************************************
 * Get all favorites for a user
 ****************************************/
async function getFavoritesByUser(account_id) {
  try {
    const sql = `
      SELECT 
        f.favorite_id,
        i.inv_id,
        i.inv_make,
        i.inv_model,
        i.inv_price,
        i.inv_thumbnail
      FROM favorites f
      JOIN inventory i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.created_at DESC;
    `;
    const result = await pool.query(sql, [account_id]);
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByUser,
};
