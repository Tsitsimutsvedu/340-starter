/* ******************************************
 * Primary server.js file for the application
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require('express');
require('dotenv').config();
const app = express();
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const messages = require('express-messages');
const pool = require('./database');

// Routes & Controllers
const staticRoutes = require('./routes/static');
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require('./routes/accountRoute');
const feedbackRoute = require('./routes/feedbackRoute');
const utilities = require('./utilities/');

/* ***********************
 * Middleware
 *************************/

// Trust proxy (important for secure cookies behind Render/Heroku/etc.)
app.set('trust proxy', 1);

// Session middleware
app.use(
  session({
    store: new (require('connect-pg-simple')(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only secure in prod
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  })
);

// Body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = messages(req, res);
  next();
});

/* ***********************
 * Global Template Variables
 *************************/
app.use((req, res, next) => {
  res.locals.loggedIn = false;
  res.locals.account = null;

  const token = req.cookies?.jwt;
  if (token) {
    try {
      const payload = utilities.decodeJWTToken(token);
      res.locals.loggedIn = true;
      res.locals.account = payload;
    } catch (err) {
      console.error('Invalid JWT:', err.message);
    }
  }
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

// Inventory route (JWT guard applied inside inventoryRoute)
app.use('/inv', inventoryRoute);

// Account route (login/register must NOT be guarded)
app.use('/account', accountRoute);

// Feedback route
app.use('/feedback', feedbackRoute);

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
  let message =
    err.status === 404 || err.status === 500
      ? err.message
      : 'Oh no! There was a crash. Maybe try a different route?';

  res.status(err.status || 500).render('errors/error', {
    title: err.status || 'Server Error',
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 10000; // Render expects dynamic PORT
const host = process.env.HOST || '0.0.0.0';

/* ***********************
 * Start Server
 *************************/
app.listen(port, host, () => {
  console.log(`✅ App listening on ${host}:${port}`);
});

