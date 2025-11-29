/* ******************************************
 * Primary server file for the application
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require('express');
require('dotenv').config();
const app = express();
const static = require('./routes/static');
const expressLayouts = require('express-ejs-layouts');
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require('./routes/accountRoute');
const utilities = require('./utilities/');
const session = require('express-session');
const pool = require('./database');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const messages = require('express-messages');
const PgSession = require('connect-pg-simple')(session);

/* ***********************
 * Middleware
 *************************/
app.use(
  session({
    store: new PgSession({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET || 'defaultSecretKey', // ✅ fallback secret
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: { secure: false }, // set to true if using HTTPS
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(utilities.checkJWTToken);

// Express Messages Middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = messages(req, res);
  next();
});

/* ***********************
 * View engine and templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

/* ***********************
 * Routes
 *************************/
app.use(static);
app.get('/', utilities.handleErrors(baseController.buildHome));
app.use('/inv', inventoryRoute);
app.use('/account', accountRoute);

// File Not Found Route
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message =
    err.status === 404 || err.status === 500
      ? err.message
      : 'Oh no! There was a crash. Maybe try a different route?';
  res.render('errors/error', {
    title: err.status || 'Server Error',
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || 'localhost';

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`✅ App listening on http://${host}:${port}`);
});
