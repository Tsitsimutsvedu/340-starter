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
 * Middleware
 *************************/
// Serve static files and routes
app.use(staticRoutes)

/* ***********************
 * Root Route
 *************************/
app.get("/", (req, res) => {
  res.send("Welcome to the 340 Starter App!")
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
