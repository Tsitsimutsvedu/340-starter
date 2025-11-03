/* ******************************************
 * Primary server file for the 340 Starter App
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()
const staticRoutes = require("./routes/static")

/* ***********************
 * View Engine Setup
 *************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

/* ***********************
 * Middleware
 *************************/
// Serve static files and routes
app.use(staticRoutes)

/* ***********************
 * Root Route
 *************************/
app.get("/", (req, res) => {
  res.render("index") // Looks for views/index.ejs
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
