const pool = require('../database');

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
	account_firstname,
	account_lastname,
	account_email,
	account_password
) {
	try {
		const sql =
			"INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
		return await pool.query(sql, [
			account_firstname,
			account_lastname,
			account_email,
			account_password,
		]);
	} catch (error) {
		return error.message;
	}
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
	try {
		const sql = 'SELECT * FROM account WHERE account_email = $1';
		const email = await pool.query(sql, [account_email]);
		return email.rowCount;
	} catch (error) {
		return error.message;
	}
}

/* **********************
 *   get existing account
 * ********************* */
async function getExistingAccount(account_email) {
	try {
		const sql = 'SELECT account_password FROM account WHERE account_email = $1';
		console.log(sql);
		const account = await pool.query(sql, [account_email]);
		if (account.rowCount === 0) return null; // no account found

		return account.rows[0].account_password; // THIS is the stored hash
	} catch (error) {
		return error.message;
	}
}

module.exports = { registerAccount, checkExistingEmail, getExistingAccount };