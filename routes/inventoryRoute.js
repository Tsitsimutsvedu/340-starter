// Needed Resources
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory detail view (single vehicle)
router.get(
  "/details/:invId",
  utilities.handleErrors(invController.buildInvDetail)
);

// Route to intentionally trigger a 500 error (for testing middleware)
router.get(
  "/trigger500",
  utilities.handleErrors(invController.throwError)
);

module.exports = router;
