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

/* ***********************
 * View Engine Setup
 *************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

/* ***********************
 * Static Assets
 *************************/
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * Routes
 *************************/
const staticRoutes = require("./routes/static")
app.use(staticRoutes)

// Root route renders index.ejs
app.get("/", (req, res) => {
  res.render("index")
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
