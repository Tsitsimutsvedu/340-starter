const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
	let nav = await utilities.getNav();
	res.render('account/login', {
		title: 'Login',
		nav,
		errors: null,
	});
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
	let nav = await utilities.getNav();
	res.render('account/register', {
		title: 'Register',
		nav,
		errors: null,
	});
}

/* ****************************************
 *  Deliver login/account view
 * ************************************ */
async function buildAccount(req, res, next) {
	let nav = await utilities.getNav();
	res.render('account/manage', {
		title: 'My Account',
		nav,
		errors: null,
	});
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
	let nav = await utilities.getNav();
	const {
		account_firstname,
		account_lastname,
		account_email,
		account_password,
	} = req.body;

	// Hash the password before storing
	let hashedPassword;
	try {
		// regular password and cost (salt is generated automatically)
		hashedPassword = await bcrypt.hashSync(account_password, 10);
	} catch (error) {
		req.flash(
			'notice',
			'Sorry, there was an error processing the registration.'
		);
		res.status(500).render('account/register', {
			title: 'Registration',
			nav,
			errors: null,
		});
	}

	const regResult = await accountModel.registerAccount(
		account_firstname,
		account_lastname,
		account_email,
		hashedPassword // Changed in hashing activity
	);

	if (regResult) {
		req.flash(
			'notice',
			`Congratulations, you\'re registered ${account_firstname}. Please log in.`
		);
		res.status(201).render('account/login', {
			errors: null,
			title: 'Login',
			nav,
		});
	} else {
		req.flash('notice', 'Sorry, the registration failed.');
		res.status(501).render('account/register', {
			errors: null,
			title: 'Registration',
			nav,
		});
	}
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function login(req, res) {
	let nav = await utilities.getNav();
	const { account_email, account_password } = req.body;
	const accountData = await accountModel.getAccountByEmail(account_email);
	if (!accountData) {
		req.flash('notice', 'Please check your credentials and try again.');
		res.status(400).render('account/login', {
			title: 'Login',
			nav,
			errors: null,
			account_email,
		});
		return;
	}
	try {
		if (await bcrypt.compare(account_password, accountData.account_password)) {
			delete accountData.account_password;
			const accessToken = jwt.sign(
				accountData,
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: 3600 * 1000 }
			);
			if (process.env.NODE_ENV === 'development') {
				res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
			} else {
				res.cookie('jwt', accessToken, {
					httpOnly: true,
					secure: true,
					maxAge: 3600 * 1000,
				});
			}
			return res.redirect('/account/');
		} else {
			req.flash(
				'message notice',
				'Please check your credentials and try again.'
			);
			res.status(400).render('account/login', {
				title: 'Login',
				nav,
				errors: null,
				account_email,
			});
		}
	} catch (error) {
		throw new Error('Access Forbidden');
	}
}

/* ****************************************
 *  Deliver account management view
 * ************************************ */
async function buildAccountManager(req, res, next) {
	let nav = await utilities.getNav();
	res.render('account/update', {
		title: 'Update My Account',
		nav,
		errors: null,
	});
}

/* ****************************************
 *  Process and build logout view
 * ************************************ */
async function logout(req, res, next) {
	try {
		res.clearCookie('jwt');
		req.flash('notice', 'Logged out');
		return res.redirect('/');
	} catch (err) {
		console.log(err);
	}
}

/* ****************************************
 *  Build delete account view
 * ************************************ */
async function buildDeleteAccount(req, res, next) {
	let nav = await utilities.getNav();
	res.render('account/delete', {
		title: 'Delete Account',
		errors: null,
		nav,
	});
}

/* ****************************************
 *  Process updateAccount request
 * ************************************ */
async function updateAccount(req, res) {
	let nav = await utilities.getNav();
	const { account_firstname, account_lastname, account_email, account_id } =
		req.body;

	const regResult = await accountModel.updateAccount(
		account_firstname,
		account_lastname,
		account_email,
		account_id
	);
	const updatedAccount = await accountModel.getAccountByid(account_id);
	const newToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: 3600 * 1000,
	});

	if (regResult) {
		if (process.env.NODE_ENV === 'development') {
			res.cookie('jwt', newToken, { httpOnly: true, maxAge: 3600 * 1000 });
		} else {
			res.cookie('jwt', newToken, {
				httpOnly: true,
				secure: true,
				maxAge: 3600 * 1000,
			});
		}
		req.flash('notice', `Account Details updated successfully`);
		res.redirect('/account/');
	} else {
		req.flash('notice', 'Update Failed');
		res.status(501).render('account/update', {
			errors: null,
			title: 'Update My Account',
			nav,
		});
	}
}

/* ****************************************
 *  Process updatePassword request
 * ************************************ */
async function updatePassword(req, res) {
	let nav = await utilities.getNav();
	const { account_password, account_id } = req.body;

	// Hash the password before storing
	let hashedPassword;
	try {
		// regular password and cost (salt is generated automatically)
		hashedPassword = await bcrypt.hashSync(account_password, 10);
	} catch (error) {
		req.flash('notice', 'Sorry, there was an error processing the update.');
		res.status(500).render('account/update', {
			title: 'Update My Account',
			nav,
			errors: null,
		});
	}

	const regResult = await accountModel.updatePassword(
		hashedPassword,
		account_id
	);

	if (regResult) {
		req.flash('notice', `Password updated successfully`);
		res.redirect('/account/');
	} else {
		req.flash('notice', 'Password Update Failed');
		res.status(501).render('account/update', {
			errors: null,
			title: 'Update My Account',
			nav,
		});
	}
}

/* ****************************************
 *  Process deleteAccount request
 * ************************************ */
async function deleteAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id } = req.body;

  let deleteResult;

  // Catches any errors returned
  try {
    deleteResult = await accountModel.deleteAccountById(account_id);
  } catch (err) {
    req.flash('notice', 'There was a problem deleting the account.');
    return res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: null
    });
  }

  // account didnt exist
  if (deleteResult.rowCount === 0) {
    req.flash('notice', 'Account not found or could not be deleted.');
    return res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: null
    });
  }

  // delete auth
  res.clearCookie('jwt');
  req.flash('notice', 'Account deleted successfully.');
  return res.redirect('/');
}

module.exports = {
	buildLogin,
	buildRegister,
	registerAccount,
	login,
	buildAccount,
	buildAccountManager,
	updateAccount,
	updatePassword,
	logout,
	buildDeleteAccount,
	deleteAccount,
};