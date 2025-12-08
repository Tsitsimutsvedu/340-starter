// Needed Resources
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');
const regValidate = require('../utilities/account-validation');

<<<<<<< HEAD
// Default route for account management
=======
/* ***********************
 * Account Routes
 *************************/

// Default account management dashboard (protected)
>>>>>>> parent of 58f4e45 (Merge branch 'main' of https://github.com/Tsitsimutsvedu/340-starter)
router.get(
  '/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
);

<<<<<<< HEAD
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
=======
/* ===== Public Routes ===== */

// Login form
router.get(
  '/login',
  utilities.handleErrors(accountController.buildLogin)
);

// Process login attempt
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.login)
);

// Registration form
router.get(
  '/register',
  utilities.handleErrors(accountController.buildRegister)
);

// Process registration
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

/* ===== Protected Routes ===== */

// Logout
router.get(
  '/logout',
  utilities.checkLogin,
  utilities.handleErrors(accountController.logout)
);

// Account update page
router.get(
  '/update/:accountId',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManager)
);

// Update name/email
>>>>>>> parent of 58f4e45 (Merge branch 'main' of https://github.com/Tsitsimutsvedu/340-starter)
router.post(
  '/update',
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

<<<<<<< HEAD
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
=======
// Update password
router.post(
  '/updatePassword',
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Delete account view
router.get(
  '/removeAccount',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildDeleteAccount)
);

// Delete account action
router.post(
  '/removeAccount',
  utilities.checkLogin,
  utilities.handleErrors(accountController.deleteAccount)
);

module.exports = router;
>>>>>>> parent of 58f4e45 (Merge branch 'main' of https://github.com/Tsitsimutsvedu/340-starter)
