// Needed Resources
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');
const regValidate = require('../utilities/account-validation');

/* ***********************
 * Account Routes
 *************************/

// Default account management dashboard (protected)
router.get(
  '/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
);

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
router.post(
  '/update',
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

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
