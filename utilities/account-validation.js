const utilities = require('.');
const { body, validationResult } = require('express-validator');
const validate = {};
const accountModel = require('../models/account-model');

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
	return [
		// firstname is required and must be a string
		body('account_firstname')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.withMessage('Please provide a first name.'), // on error this message is sent

		// lastname is requred and must be a string
		body('account_lastname')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 2 })
			.withMessage('Please provide a last name.'),

		// valid email is required and cannot already exist in the database
		body('account_email')
			.trim()
			.isEmail()
			.normalizeEmail() // refer to validator.js docs
			.withMessage('A valid email is required.')
			.custom(async (account_email) => {
				const emailExists = await accountModel.checkExistingEmail(
					account_email
				);
				if (emailExists) {
					throw new Error('Email exists. Please log in or use different email');
				}
			}),

		// password is required and must be a strong password
		body('account_password')
			.trim()
			.notEmpty()
			.isStrongPassword({
				minLength: 12,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1,
			})
			.withMessage('Password does not meet requirements'),
	];
};

/*  **********************************
 *  Login Data Validation Rules
 *  Added to try and validate login
 * ********************************* */
validate.loginRules = () => {
	return [
		body('account_email')
			.trim()
			.isEmail()
			.normalizeEmail() // refer to validator.js docs
			.withMessage('A valid email is required.')
			.custom(async (account_email) => {
				const emailExists = await accountModel.checkExistingEmail(
					account_email
				);
				if (!emailExists) {
					throw new Error(
						'Email is not registered. Please register or use different email'
					);
				}
			}),
		// password is required and must be a strong password, must match account
		body('account_password')
			.trim()
			.notEmpty()
			.withMessage('Password does not meet requirements'),
	];
};

/*  **********************************
 *  Update Account Data Validation Rules
 * ********************************* */
validate.updateRules = () => {
	return [
		// firstname is required and must be a string
		body('account_firstname')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.withMessage('Please provide a first name.'), // on error this message is sent

		// lastname is requred and must be a string
		body('account_lastname')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 2 })
			.withMessage('Please provide a last name.'),

		// account id exists, is numeric
		body('account_id').isNumeric().withMessage('Invalid account ID.'),

		// account email is required, must not exist tied to another account
		body('account_email')
			.trim()
			.isEmail()
			.normalizeEmail() // refer to validator.js docs
			.withMessage('A valid email is required.')
			.custom(async (account_email, { req }) => {
				const emailExists = await accountModel.checkExistingEmail(
					account_email
				);
				if (emailExists) {
					// Check if the email is connected to this account
					const connectedAccount = await accountModel.getAccountByEmail(
						account_email
					);
					// if connected to a different account; throw error
					if (connectedAccount.account_id !== parseInt(req.body.account_id)) {
						throw new Error('Invalid email. Please choose another email.');
					}
					// otherwise let them keep the same email
				}
			}),
	];
};

/*  **********************************
 *  Update Password Data Validation Rules
 * ********************************* */
validate.updatePasswordRules = () => {
	return [
		// password is required and must be a strong password
		body('account_password')
			.trim()
			.notEmpty()
			.isStrongPassword({
				minLength: 12,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1,
			})
			.withMessage('Password does not meet requirements'),
	];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
	const { account_firstname, account_lastname, account_email } = req.body;
	let errors = [];
	errors = validationResult(req);
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav();
		res.render('account/register', {
			errors,
			title: 'Register',
			nav,
			account_firstname,
			account_lastname,
			account_email,
		});
		return;
	}
	next();
};

/* ******************************
 * Check data and return errors or continue to registration
 * Added to try and validate login
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
	const { account_email } = req.body;
	let errors = [];
	errors = validationResult(req);
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav();
		res.render('account/login', {
			errors,
			title: 'Login',
			nav,
			account_email,
		});
		return;
	}
	next();
};

/* ******************************
 * Check data and return errors or continue to update account
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
	const { account_firstname, account_lastname, account_email, account_id } =
		req.body;
	let errors = [];
	errors = validationResult(req);
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav();
		res.render('account/update', {
			errors,
			title: 'Update My Account',
			nav,
			account_email,
			account_firstname,
			account_lastname,
			account_id,
		});
		return;
	}
	next();
};

/* ******************************
 * Check data and return errors or continue to update password
 * ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
	const { account_password, account_id } =
		req.body;
	let errors = [];
	errors = validationResult(req);
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav();
		res.render('account/update', {
			errors,
			title: 'Update My Account',
			nav,
			account_password,
			account_id,
		});
		return;
	}
	next();
};

module.exports = validate;