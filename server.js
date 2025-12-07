/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const env = require('dotenv').config();
const app = express();
<<<<<<< HEAD
const static = require('./routes/static');
=======
const staticRoutes = require('./routes/static');
>>>>>>> 07b6a9c2f89ae7214e7ef8da6a05bda94d9dc015
const expressLayouts = require('express-ejs-layouts');
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require('./routes/accountRoute');
const utilities = require('./utilities/');
const session = require('express-session');
const pool = require('./database');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
<<<<<<< HEAD

/* ***********************
 * Middleware
 * ************************/
app.use(
	session({
		store: new (require('connect-pg-simple')(session))({
			createTableIfMissing: true,
			pool,
		}),
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
		name: 'sessionId',
	})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
=======
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
>>>>>>> 07b6a9c2f89ae7214e7ef8da6a05bda94d9dc015
app.use(cookieParser());
app.use(utilities.checkJWTToken);

<<<<<<< HEAD
// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
=======
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
>>>>>>> 07b6a9c2f89ae7214e7ef8da6a05bda94d9dc015
});

/* ***********************
 * View engine and templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout'); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);
// Index route
app.get('/', utilities.handleErrors(baseController.buildHome));
<<<<<<< HEAD
// Inventory route
app.use('/inv', inventoryRoute);
// Account route
app.use('/account', accountRoute);
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
	next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
=======

// Inventory route (protected with JWT)
app.use('/inv', utilities.checkJWTToken, inventoryRoute);

// Feedback route (protected with JWT)
app.use('/feedback', utilities.checkJWTToken, feedbackRoute);

// Account route (mixed: login/register public, others protected inside accountRoute.js)
app.use('/account', accountRoute);

// Favicon route to prevent errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

/* ***********************
 * File Not Found Route - must be last
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
>>>>>>> 07b6a9c2f89ae7214e7ef8da6a05bda94d9dc015
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
<<<<<<< HEAD
	let nav = await utilities.getNav();
	console.error(`Error at: "${req.originalUrl}": ${err.message}`);
	if (err.status == 404) {
		message = err.message;
	} else if (err.status === 500) {
		message = err.message;
	} else {
		message = ' Oh no! There was a crash. Maybe try a different route?';
	}
	res.render('errors/error', {
		title: err.status || 'Server Error',
		message,
		nav,
	});
=======
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const status = err.status || 500;
  const message = err.message || 'Unexpected server error';
  res.status(status).render('errors/error', {
    title: status,
    message,
    nav,
  });
>>>>>>> 07b6a9c2f89ae7214e7ef8da6a05bda94d9dc015
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
<<<<<<< HEAD
const port = process.env.PORT;
const host = process.env.HOST;
=======
const port = process.env.PORT || 10000; // Render sets PORT automatically
const host = '0.0.0.0';
>>>>>>> 07b6a9c2f89ae7214e7ef8da6a05bda94d9dc015

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
	console.log(`app listening on ${host}:${port}`);
});
