const pool = require('../database');

/* ****************************************
 * Get all classifications
 **************************************** */
async function getClassifications() {
  try {
    const sql = 'SELECT classification_id, classification_name FROM classification ORDER BY classification_name ASC';
    const result = await pool.query(sql);
    return result;
  } catch (error) {
    console.error('getClassifications error:', error);
    return { rows: [] };
  }
}

/* ****************************************
 * Get inventory by classification ID
 **************************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, classification_id
      FROM inventory
      WHERE classification_id = $1
      ORDER BY inv_make, inv_model
    `;
    const result = await pool.query(sql, [classification_id]);
    return result.rows;
  } catch (error) {
    console.error('getInventoryByClassificationId error:', error);
    return [];
  }
}

/* ****************************************
 * Get inventory details by inventory ID
 **************************************** */
async function getInventoryById(inv_id) {
  try {
    const sql = `
      SELECT inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, classification_id
      FROM inventory
      WHERE inv_id = $1
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error('getInventoryById error:', error);
    return [];
  }
}

/* ****************************************
 * Add a new classification
 **************************************** */
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING *
    `;
    const result = await pool.query(sql, [classification_name]);
    return result;
  } catch (error) {
    console.error('addClassification error:', error);
    return null;
  }
}

/* ****************************************
 * Add a new inventory item
 **************************************** */
async function addInventory(invData) {
  try {
    const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, classification_id } = invData;
    const sql = `
      INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, classification_id]);
    return result;
  } catch (error) {
    console.error('addInventory error:', error);
    return null;
  }
}

/* ****************************************
 * Update inventory item
 **************************************** */
async function updateInventory(invData) {
  try {
    const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, classification_id } = invData;
    const sql = `
      UPDATE inventory
      SET inv_make=$1, inv_model=$2, inv_description=$3, inv_image=$4, inv_thumbnail=$5, inv_price=$6, inv_miles=$7, classification_id=$8
      WHERE inv_id=$9
      RETURNING *
    `;
    const result = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, classification_id, inv_id]);
    return result;
  } catch (error) {
    console.error('updateInventory error:', error);
    return null;
  }
}

/* ****************************************
 * Delete inventory item
 **************************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id=$1 RETURNING *';
    const result = await pool.query(sql, [inv_id]);
    return result;
  } catch (error) {
    console.error('deleteInventory error:', error);
    return null;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory,
};
