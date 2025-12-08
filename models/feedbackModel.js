const db = require('../database');

exports.addFeedback = async (account_id, message) => {
  const sql = 'INSERT INTO feedback (account_id, message) VALUES ($1, $2) RETURNING feedback_id';
  const result = await db.query(sql, [account_id, message]);
  return result.rows[0];
};

exports.getFeedbackByUser = async (account_id) => {
  const sql = 'SELECT * FROM feedback WHERE account_id = $1 ORDER BY created_at DESC';
  const result = await db.query(sql, [account_id]);
  return result.rows;
};

exports.getAllFeedback = async () => {
  const sql = 'SELECT f.*, a.account_firstname FROM feedback f JOIN account a ON f.account_id = a.account_id ORDER BY created_at DESC';
  const result = await db.query(sql);
  return result.rows;
};
