// Needed Resources
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');
const regValidate = require('../utilities/account-validation');

// Route for login
router.get('/login', utilities.handleErrors(accountController.buildLogin));

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
// Added to try and validate login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.login)
);

module.exports = router;