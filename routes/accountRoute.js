// Needed Resources
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');
const regValidate = require('../utilities/account-validation');

/* ***********************
 * Account Routes
 *************************/

// Default account management (protected)
router.get(
  '/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
);

// Login form (public)
router.get(
  '/login',
  utilities.handleErrors(accountController.buildLogin)
);

// Process login attempt (public)
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.login)
);

// Logout (protected)
router.get(
  '/logout',
  utilities.checkLogin,
  utilities.handleErrors(accountController.logout)
);

// Registration form (public)
router.get(
  '/register',
  utilities.handleErrors(accountController.buildRegister)
);

// Process registration (public)
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Account update page (protected)
router.get(
  '/update/:accountId',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManager)
);

// Update name/email (protected)
router.post(
  '/update',
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Update password (protected)
router.post(
  '/updatePassword',
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Delete account view (protected)
router.get(
  '/removeAccount',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildDeleteAccount)
);

// Delete account action (protected)
router.post(
  '/removeAccount',
  utilities.checkLogin,
  utilities.handleErrors(accountController.deleteAccount)
);

module.exports = router;
