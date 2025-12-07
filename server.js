/* ******************************************
 * Primary server.js file for the application
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const env = require('dotenv').config();
const app = express();
const staticRoutes = require('./routes/static');
const expressLayouts = require('express-ejs-layouts');
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require('./routes/accountRoute');
const feedbackRoute = require('./routes/feedbackRoute');
const utilities = require('./utilities/');
const session = require('express-session');
const pool = require('./database');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

/* ***********************
 * Middleware
 *************************/
app.use(
  session({
    store: new (require('connect-pg-simple')(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// JWT check AFTER parsers
app.use(utilities.checkJWTToken);

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

/* ***********************
 * Global Template Variables
 *************************/
app.use((req, res, next) => {
  res.locals.loggedIn = req.session?.loggedIn || false;
  res.locals.account = req.session?.account || null;
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
app.use(staticRoutes);

// Index route
app.get('/', utilities.handleErrors(baseController.buildHome));

// Inventory route
app.use('/inv', inventoryRoute);

// Account route
app.use('/account', accountRoute);

// Feedback route
app.use('/feedback', feedbackRoute);

// Favicon route to prevent errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// File Not Found Route - must be last
app.use((req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const status = err.status || 500;
  let message = err.message || 'Unexpected server error';
  res.status(status).render('errors/error', {
    title: status,
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 10000; // Render expects 10000
const host = process.env.HOST || '0.0.0.0';

/* ***********************
 * Start Server
 *************************/
app.listen(port, host, () => {
  console.log(`✅ App listening on ${host}:${port}`);
});

