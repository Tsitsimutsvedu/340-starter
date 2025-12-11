const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ***************************************
 * Render login page
 **************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav();
  res.render('account/login', {
    title: 'Login',
    nav,
    errors: null,
  });
}

/* ***************************************
 * Render registration page
 **************************************** */
async function buildRegister(req, res) {
  const nav = await utilities.getNav();
  res.render('account/register', {
    title: 'Register',
    nav,
    errors: null,
  });
}

/* ***************************************
 * Render account management page
 **************************************** */
async function buildAccount(req, res) {
  const nav = await utilities.getNav();
  res.render('account/manage', {
    title: 'My Account',
    nav,
    errors: null,
  });
}

/* ***************************************
 * Register a new account
 **************************************** */
async function registerAccount(req, res) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const result = await accountModel.registerAccount(
      account_firstname, account_lastname, account_email, hashedPassword
    );

    if (result) {
      req.flash('notice', `Congratulations, ${account_firstname}, you are registered! Please log in.`);
      return res.status(201).render('account/login', { title: 'Login', nav, errors: null });
    } else {
      req.flash('notice', 'Registration failed. Please try again.');
      return res.status(400).render('account/register', { title: 'Register', nav, errors: null });
    }
  } catch (error) {
    console.error(error);
    req.flash('notice', 'Error during registration. Please try again.');
    return res.status(500).render('account/register', { title: 'Register', nav, errors: null });
  }
}

/* ***************************************
 * Process login
 **************************************** */
async function login(req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash('notice', 'Invalid credentials. Try again.');
      return res.status(400).render('account/login', { title: 'Login', nav, errors: null, account_email });
    }

    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
    if (!passwordMatch) {
      req.flash('notice', 'Invalid credentials. Try again.');
      return res.status(400).render('account/login', { title: 'Login', nav, errors: null, account_email });
    }

    delete accountData.account_password;

    const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000,
    });

    return res.redirect('/account/');
  } catch (error) {
    console.error(error);
    req.flash('notice', 'Login failed. Try again.');
    return res.status(500).render('account/login', { title: 'Login', nav, errors: null });
  }
}

/* ***************************************
 * Render account update page
 **************************************** */
async function buildAccountManager(req, res) {
  const nav = await utilities.getNav();
  res.render('account/update', {
    title: 'Update Account',
    nav,
    errors: null,
  });
}

/* ***************************************
 * Update account info
 **************************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } = req.body;

  try {
    const updated = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id);
    if (!updated) throw new Error('Update failed');

    const newToken = jwt.sign(updated, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
    res.cookie('jwt', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000,
    });

    req.flash('notice', 'Account updated successfully');
    return res.redirect('/account/');
  } catch (error) {
    console.error(error);
    req.flash('notice', 'Account update failed.');
    return res.status(500).render('account/update', { title: 'Update Account', nav, errors: null });
  }
}

/* ***************************************
 * Update password
 **************************************** */
async function updatePassword(req, res) {
  const nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updated = await accountModel.updatePassword(hashedPassword, account_id);

    if (!updated) throw new Error('Password update failed');

    req.flash('notice', 'Password updated successfully');
    return res.redirect('/account/');
  } catch (error) {
    console.error(error);
    req.flash('notice', 'Password update failed.');
    return res.status(500).render('account/update', { title: 'Update Account', nav, errors: null });
  }
}

/* ***************************************
 * Logout
 **************************************** */
async function logout(req, res) {
  res.clearCookie('jwt');
  req.flash('notice', 'Logged out successfully');
  return res.redirect('/');
}

/* ***************************************
 * Render delete account page
 **************************************** */
async function buildDeleteAccount(req, res) {
  const nav = await utilities.getNav();
  res.render('account/delete', { title: 'Delete Account', nav, errors: null });
}

/* ***************************************
 * Delete account
 **************************************** */
async function deleteAccount(req, res) {
  const nav = await utilities.getNav();
  const { account_id } = req.body;

  try {
    const deleted = await accountModel.deleteAccountById(account_id);
    if (!deleted) throw new Error('Delete failed');

    res.clearCookie('jwt');
    req.flash('notice', 'Account deleted successfully');
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    req.flash('notice', 'Account deletion failed.');
    return res.status(500).render('account/manage', { title: 'My Account', nav, errors: null });
  }
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
