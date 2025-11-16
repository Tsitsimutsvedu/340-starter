const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
	const classification_id = req.params.classificationId;
	const data = await invModel.getInventoryByClassificationId(classification_id);
	const grid = await utilities.buildClassificationGrid(data);
	let nav = await utilities.getNav();
	const className = data[0].classification_name;
	res.render('./inventory/classification', {
		title: className + ' vehicles',
		nav,
		grid,
	});
};

/* ***************************
 *  Build Inventory Detail Page
 * ************************** */
invCont.buildInvDetail = async function (req, res, next) {
	const inv_id = await req.params.invId;
	const data = await invModel.getInvItemById(inv_id);
	const details = await utilities.buildInvDetail(data);
	let nav = await utilities.getNav();
	console.log(data);
	res.render('./inventory/invDetail', {
		title: data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model,
		nav,
		details,
	});
};

invCont.throwError = async function(req, res){
	const error = new Error("Internal Server Error: Something Went Wrong! (Intentionally)");
	error.status = 500;
	throw error;
};

module.exports = invCont;