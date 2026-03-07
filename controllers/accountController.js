const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const messageModel = require("../models/message-model");

/* Registration view */
async function buildRegister(req, res) {
  res.render("account/register", { title: "Register", errors: null });
}

/* Process Registration */
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      return res.redirect("/account/login");
    }

    req.flash("notice", "Registration failed.");
    return res.render("account/register", { title: "Register", errors: null });

  } catch (error) {
    console.error("Registration error:", error);
    req.flash("notice", "Registration processing error.");
    return res.render("account/register", { title: "Register", errors: null });
  }
}

/* Login view */
async function buildLogin(req, res) {
  res.render("account/login", { title: "Login", errors: null });
}

/* Login POST request */
async function accountLogin(req, res) {
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData || !(await bcrypt.compare(account_password, accountData.account_password))) {
      req.flash("notice", "Incorrect credentials.");
      return res.render("account/login", { title: "Login", errors: null, account_email });
    }

    delete accountData.account_password;
    utilities.updateCookie(accountData, res);

    return res.redirect("/account/");
  } catch (error) {
    console.error("Login error:", error);
    req.flash("notice", "Login failed.");
    return res.render("account/login", { title: "Login", errors: null });
  }
}

/* Account management view */
async function buildAccountManagementView(req, res) {
  try {
    const unread = await messageModel.getMessageCountById(res.locals.accountData.account_id);
    res.render("account/account-management", { title: "Account Management", errors: null, unread });
  } catch (error) {
    console.error("Account management error:", error);
    res.render("account/account-management", { title: "Account Management", errors: ["Error loading data"] });
  }
}

/* Logout */
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  delete res.locals.accountData;
  req.flash("notice", "Logout successful.");
  return res.redirect("/");
}

/* Account update view */
async function buildUpdate(req, res) {
  try {
    const accountDetails = await accountModel.getAccountById(req.params.accountId);
    res.render("account/update", { title: "Update Account", errors: null, ...accountDetails });
  } catch (error) {
    console.error("Update view error:", error);
    res.render("account/update", { title: "Update Account", errors: ["Error loading account"] });
  }
}

/* Account update POST */
async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  try {
    const result = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);

    if (!result) {
      req.flash("notice", "Account update failed.");
      return res.render("account/update", { title: "Update Account", errors: null, account_id, account_firstname, account_lastname, account_email });
    }

    req.flash("notice", "Account updated successfully.");
    const updatedAccount = await accountModel.getAccountById(account_id);
    delete updatedAccount.account_password;
    res.locals.accountData = updatedAccount;
    utilities.updateCookie(updatedAccount, res);

    return res.redirect("/account/");
  } catch (error) {
    console.error("Update account error:", error);
    req.flash("notice", "Account update failed.");
    return res.render("account/update", { title: "Update Account", errors: null });
  }
}

/* Password update POST */
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const result = await accountModel.updatePassword(account_id, hashedPassword);

    if (!result) {
      req.flash("notice", "Password update failed.");
      return res.render("account/update", { title: "Update Account", errors: null, ...res.locals.accountData });
    }

    req.flash("notice", "Password updated successfully.");
    return res.redirect("/account/");
  } catch (error) {
    console.error("Password update error:", error);
    req.flash("notice", "Password update failed.");
    return res.render("account/update", { title: "Update Account", errors: null, ...res.locals.accountData });
  }
}

/* Manage accounts view */
async function buildManageAccounts(req, res) {
  try {
    const accounts = await accountModel.getAllAccounts();
    res.render("account/manage", { title: "Manage Accounts", accounts, errors: null });
  } catch (error) {
    console.error("Manage accounts error:", error);
    res.render("account/manage", { title: "Manage Accounts", accounts: [], errors: ["Error loading accounts"] });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagementView,
  accountLogout,
  buildUpdate,
  updateAccount,
  updatePassword,
  buildManageAccounts
};
