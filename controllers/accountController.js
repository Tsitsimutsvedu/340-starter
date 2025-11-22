const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');

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
 *  Process Login
 *  Added to try and validate login
 * *************************************** */
async function login(req, res) {
	let nav = await utilities.getNav();
	const { account_email, account_password } = req.body;

	const regResult = await accountModel.checkExistingEmail(account_email);
	let validPass;
	if(regResult){
		const formPassword = await accountModel.getExistingAccount(account_email);
		validPass = await bcrypt.compare(account_password, formPassword);
	}else{
		validPass = false;
	}

	if (validPass) {
		req.flash('notice', `Log in success.`);
		res.status(201).render('account/login', {
			errors: null,
			title: 'Login',
			nav,
		});
	} else {
		req.flash('notice', 'Sorry, the login failed.');
		res.status(501).render('account/login', {
			errors: null,
			title: 'Login',
			nav,
		});
	}
}

module.exports = { buildLogin, buildRegister, registerAccount, login };