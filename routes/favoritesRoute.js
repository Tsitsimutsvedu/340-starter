const express = require("express");
const router = new express.Router();

const favoritesController = require("../controllers/favoritesController");
const utilities = require("../utilities");

/* ***************************************
 * My Favorites page
 ****************************************/
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.buildFavoritesView)
);

/* ***************************************
 * Add to favorites
 ****************************************/
router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.addFavoriteAction)
);

/* ***************************************
 * Remove from favorites
 ****************************************/
router.post(
  "/remove",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.removeFavoriteAction)
);

module.exports = router;
