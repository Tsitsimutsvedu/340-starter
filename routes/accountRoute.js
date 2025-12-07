// Needed Resources
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');
const regValidate = require('../utilities/account-validation');

/* ******************************************
 * Account Routes
 ******************************************/

// Default account dashboard (requires login)
router.get(
  '/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
);

// Login form (public)
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Process login attempt (public)
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.login)
);

// Logout (requires login)
router.post('/logout', utilities.checkLogin, utilities.handleErrors(accountController.logout));

// Registration form (public)
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Process registration (public)
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Build account update view (requires login)
router.get(
  '/update/:accountId',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
);

// Process account info update (requires login)
router.post(
  '/update',
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process password update (requires login)
router.post(
  '/update-password',
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Build delete account view (requires login)
router.get(
  '/remove',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildDeleteAccount)
);

// Process account deletion (requires login)
router.post(
  '/remove',
  utilities.checkLogin,
  utilities.handleErrors(accountController.deleteAccount)
);

module.exports = router;

