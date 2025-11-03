/* ******************************************
 * Primary server file for the 340 Starter App
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const app = express()

/* ***********************
 * View Engine Setup
 *************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "layouts/layout") // Looks for views/layouts/layout.ejs

/* ***********************
 * Static Assets
 *************************/
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * Routes
 *************************/
const staticRoutes = require("./routes/static")
app.use(staticRoutes)

// Root route renders index.ejs inside layout.ejs
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})

/* ***********************
 * Error Handling
 *************************/
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message)
  console.error(err.stack)
  res.status(500).send("Internal Server Error")
})

/* ***********************
 * Server Configuration
 *************************/
const port = process.env.PORT || 5502
const host = process.env.HOST || "localhost"

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`)
})

