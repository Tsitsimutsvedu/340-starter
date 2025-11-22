const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();

    // Handle case where no vehicles are found
    const className = data.length > 0 ? data[0].classification_name : "Inventory";

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
      messages: [] // ✅ Always pass messages
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build Inventory Detail Page
 * ************************** */
invCont.buildInvDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.invId; // ✅ no await needed
    const data = await invModel.getInvItemById(inv_id);
    const details = await utilities.buildInvDetail(data);
    const nav = await utilities.getNav();

    if (!data || data.length === 0) {
      // If no vehicle found, throw 404
      const error = new Error("Vehicle not found");
      error.status = 404;
      throw error;
    }

    res.render("./inventory/invDetail", {
      title: `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`,
      nav,
      details,
      messages: [] // ✅ Always pass messages
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Trigger intentional 500 error
 * ************************** */
invCont.throwError = async function (req, res, next) {
  const error = new Error("Internal Server Error: Something Went Wrong! (Intentionally)");
  error.status = 500;
  next(error); // ✅ pass to middleware
};

module.exports = invCont;
