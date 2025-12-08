// Needed Resources
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');
const regValidate = require('../utilities/account-validation');

// Default route for account management
router.get(
	'/',
	utilities.checkLogin,
	utilities.handleErrors(accountController.buildAccount)
);

// Route for login
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route for logout
router.get('/logout', utilities.handleErrors(accountController.logout));

// Route for registration form
router.get(
	'/register',
	utilities.handleErrors(accountController.buildRegister)
);

// Route to actually register
router.post(
	'/register',
	regValidate.registrationRules(),
	regValidate.checkRegData,
	utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
	'/login',
	regValidate.loginRules(),
	regValidate.checkLogData,
	utilities.handleErrors(accountController.login)
);

// Route to build account update page
router.get(
	'/update/:accountId',
	utilities.checkLogin,
	utilities.handleErrors(accountController.buildAccountManager)
);

// Route to handle updating name/email
router.post(
	'/update',
	regValidate.updateRules(),
	regValidate.checkUpdateData,
	utilities.handleErrors(accountController.updateAccount)
);

// Route to handle updating password
router.post(
	'/updatePassword',
	regValidate.updatePasswordRules(),
	regValidate.checkUpdatePasswordData,
	utilities.handleErrors(accountController.updatePassword)
);

// Route to handle deleting account view
router.get(
	'/removeAccount',
	utilities.checkLogin,
	utilities.handleErrors(accountController.buildDeleteAccount)
);

// Route to handle deleting the account
router.post(
	'/removeAccount',
	utilities.checkLogin,
	utilities.handleErrors(accountController.deleteAccount)
);

module.exports = router;
