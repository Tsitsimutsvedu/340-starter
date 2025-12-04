/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const pgStore = require("connect-pg-simple")(session);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const utilities = require("./utilities/");
const pool = require("./database/");

/* ******************************************
 * CSE Motors App Server Setup
 *******************************************/
const app = express();

/* ***********************
 * Global Middleware
 *************************/
app.use(async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.locals.nav = nav; // available to all views
    next();
  } catch (err) {
    console.error("❌ nav middleware error:", err);
    next(err);
  }
});

/* ***********************
 * Session & Flash Middleware
 *************************/
app.use(session({
  store: new pgStore({
    pool,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || "fallbackSecret", // ensure this is set in Render
  resave: false,              // recommended default
  saveUninitialized: false,   // recommended default
  name: "sessionId",
  cookie: {
    secure: process.env.NODE_ENV === "production", // secure cookies in production
    httpOnly: true,
  }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

/* ***********************
 * Middleware
 *************************/
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for form data parsing
app.use(cookieParser());
app.use(utilities.checkJWTToken);

/* ***********************
 * View Engine & Layouts
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
const staticRoutes = require("./routes/static");
const inventoryRoutes = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController");
const accountRoute = require("./routes/accountRoute");

app.use("/", staticRoutes);
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoutes);
app.use("/account", accountRoute);

/* ***********************
 * 404 & Error Handling
 *************************/
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
    message: "Sorry, we appear to have lost that page.",
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).render("error", {
    title: "Server Error",
    message: err.message,
  });
});

/* ***********************
 * Server Startup
 *************************/
const port = process.env.PORT || 5500;

app.listen(port, () => {
  console.log(`🚗 CSE Motors running at http://localhost:${port}`);
});
