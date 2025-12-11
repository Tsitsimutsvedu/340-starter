const favoritesModel = require("../models/favorites-model");
const utilities = require("../utilities");

/* ***************************************
 * Build "My Favorites" view
 ****************************************/
async function buildFavoritesView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const accountData = res.locals.accountData;

    if (!accountData) {
      req.flash("notice", "You must be logged in to view favorites.");
      return res.redirect("/account/login");
    }

    const account_id = accountData.account_id;
    const favResult = await favoritesModel.getFavoritesByUser(account_id);

    res.render("favorites/index", {
      title: "My Favorites",
      nav,
      favorites: favResult.rows,
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************************
 * Handle add to favorites
 ****************************************/
async function addFavoriteAction(req, res, next) {
  try {
    const accountData = res.locals.accountData;
    if (!accountData) {
      req.flash("notice", "You must be logged in to add favorites.");
      return res.redirect("/account/login");
    }

    const account_id = accountData.account_id;
    const { inv_id } = req.body;

    if (!inv_id) {
      req.flash("notice", "Invalid vehicle.");
      return res.redirect("/inv/");
    }

    await favoritesModel.addFavorite(account_id, inv_id);

    req.flash("notice", "Added to favorites.");
    res.redirect(`/inv/details/${inv_id}`);
  } catch (error) {
    next(error);
  }
}

/* ***************************************
 * Handle remove from favorites
 ****************************************/
async function removeFavoriteAction(req, res, next) {
  try {
    const accountData = res.locals.accountData;
    if (!accountData) {
      req.flash("notice", "You must be logged in.");
      return res.redirect("/account/login");
    }

    const account_id = accountData.account_id;
    const { inv_id } = req.body;

    if (!inv_id) {
      req.flash("notice", "Invalid vehicle.");
      return res.redirect("/favorites");
    }

    await favoritesModel.removeFavorite(account_id, inv_id);

    req.flash("notice", "Removed from favorites.");
    res.redirect("/favorites");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildFavoritesView,
  addFavoriteAction,
  removeFavoriteAction,
};
