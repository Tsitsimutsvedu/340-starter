const pool = require("../database"); // make sure this points to your db connection

/* Register new account */
async function registerAccount(firstname, lastname, email, password) {
  const sql = `
    INSERT INTO account 
      (account_firstname, account_lastname, account_email, account_password, account_type) 
    VALUES ($1, $2, $3, $4, 'Client') 
    RETURNING *;
  `;
  const result = await pool.query(sql, [firstname, lastname, email, password]);
  return result.rows[0] || null;
}

/* Check for existing email */
async function checkExistingEmail(email, excludedEmail = null) {
  const sql = excludedEmail
    ? "SELECT 1 FROM account WHERE account_email = $1 AND account_email != $2"
    : "SELECT 1 FROM account WHERE account_email = $1";
  const params = excludedEmail ? [email, excludedEmail] : [email];
  const result = await pool.query(sql, params);
  return result.rowCount > 0;
}

/* Return account data using email address */
async function getAccountByEmail(email) {
  const sql = `
    SELECT account_id, account_firstname, account_lastname, 
           account_email, account_type, account_password 
    FROM account 
    WHERE account_email = $1;
  `;
  const result = await pool.query(sql, [email]);
  return result.rows[0] || null;
}

/* Return account data using account id */
async function getAccountById(account_id) {
  const sql = `
    SELECT account_id, account_firstname, account_lastname, 
           account_email, account_type, account_password 
    FROM account 
    WHERE account_id = $1;
  `;
  const result = await pool.query(sql, [account_id]);
  return result.rows[0] || null;
}

/* Update account info */
async function updateAccount(account_id, firstname, lastname, email) {
  const sql = `
    UPDATE account 
    SET account_firstname = $1, account_lastname = $2, account_email = $3 
    WHERE account_id = $4 
    RETURNING *;
  `;
  const result = await pool.query(sql, [firstname, lastname, email, account_id]);
  return result.rows[0] || null;
}

/* Update password */
async function updatePassword(account_id, hashedPassword) {
  const sql = `
    UPDATE account 
    SET account_password = $1 
    WHERE account_id = $2 
    RETURNING *;
  `;
  const result = await pool.query(sql, [hashedPassword, account_id]);
  return result.rows[0] || null;
}

/* Get all accounts for management */
async function getAllAccounts() {
  const sql = `
    SELECT account_id, account_firstname, account_lastname, 
           account_email, account_type 
    FROM account 
    ORDER BY account_id;
  `;
  const result = await pool.query(sql);
  return result.rows || [];
}

/* Get account list (for dropdowns etc.) */
async function getAccountList() {
  const sql = `
    SELECT account_id, account_firstname, account_lastname 
    FROM account 
    ORDER BY account_lastname ASC;
  `;
  const result = await pool.query(sql);
  return result.rows || [];
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
  getAllAccounts,
  getAccountList,
};
