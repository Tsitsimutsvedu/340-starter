// System dependencies
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
require("dotenv").config()

// Project files
const staticRoutes = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const messageRoute = require("./routes/messageRoute")
const intentionalErrorRoute = require("./routes/intentionalErrorRoute")
const utilities = require("./utilities")
const pool = require("./database")
const invModel = require("./models/inventory-model")

// FIXED: match filename exactly
const serviceRoutes = require("./routes/serviceRoutes")

// Initialize app
const app = express()

// Session middleware
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "default-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
)

// Session data available in views
app.use((req, res, next) => {
  res.locals.loggedin = req.session.loggedin || false
  res.locals.accountData = req.session.accountData || {}
  next()
})

// Flash messages
app.use(require("connect-flash")())
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Cookie parser
app.use(cookieParser())

// JWT middleware
app.use(utilities.checkJWTToken)

// View engine
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

// Service route (Enhancement Week 6)
app.use("/service", serviceRoutes)

// Static routes
app.use(staticRoutes)

// Load classifications globally
app.use(async (req, res, next) => {
  try {
    const result = await invModel.getClassifications()
    res.locals.classifications = Array.isArray(result.rows)
      ? result.rows
      : []
    next()
  } catch (error) {
    console.error("Error loading classifications:", error)
    res.locals.classifications = []
    next()
  }
})

// Home route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)

// Message routes
app.use("/message", messageRoute)

// Intentional error test
app.use("/ierror", intentionalErrorRoute)

// 404 handler
app.use((req, res, next) => {
  next({
    status: 404,
    message: "Unfortunately, we don't have that page in stock.",
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(`Error at "${req.originalUrl}": ${err.message}`)

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
  })
})

// Start server
const port = process.env.PORT || 5500
const host = process.env.HOST || "0.0.0.0"

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`)
})