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

/* ***************************
 *  Build Inventory Management Page
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
	let nav = await utilities.getNav();
	res.render('./inventory/management', {
		title: 'Inventory Management',
		nav,
	});
};

/* ***************************
 *  Build Add Classification  Page
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
	let nav = await utilities.getNav();
	res.render('./inventory/add-classification', {
		title: 'Add Classification',
		nav,
		errors: null,
	});
};

/* ***************************
 *  Build Add Inventory  Page
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
	let nav = await utilities.getNav();
	let dropDown = await utilities.buildClassificationList();
	res.render('./inventory/add-inventory', {
		title: 'Add Inventory',
		nav,
		dropDown: dropDown,
		errors: null,
		classification_id: null,
	});
};

/* ***************************
 *  Handle Adding a Classification
 * ************************** */
invCont.addClassification = async function (req, res) {
	const { classification_name } = req.body;

	const addClassResult = await invModel.addClassification(classification_name);
	let nav = await utilities.getNav();
	if (addClassResult) {
		req.flash(
			'notice',
			`You\'ve added a new Classification: ${classification_name}`
		);
		res.status(201).render('inventory/add-classification', {
			errors: null,
			title: 'Add Classification',
			nav,
		});
	} else {
		req.flash('notice', 'Sorry, failed to add a new Classification.');
		res.status(501).render('inventory/add-classification', {
			errors: null,
			title: 'Add Classification',
			nav,
		});
	}
};

/* ***************************
 *  Handle Adding an Inventory Item
 * ************************** */
invCont.addInventory = async function (req, res) {
	let {
		inv_make,
		inv_model,
		inv_year,
		inv_description,
		inv_image,
		inv_thumbnail,
		inv_price,
		inv_miles,
		inv_color,
		classification_id,
	} = req.body;
	const addInvResult = await invModel.addInventory(
		inv_make,
		inv_model,
		inv_year,
		inv_description,
		inv_image,
		inv_thumbnail,
		inv_price,
		inv_miles,
		inv_color,
		classification_id
	);
	let nav = await utilities.getNav();
	let dropDown = await utilities.buildClassificationList(classification_id);
	if (addInvResult) {
		req.flash(
			'notice',
			`You\'ve added a new Inventory Item: ${inv_year} ${inv_make} ${inv_model}`
		);
		return res.redirect('/inv/');
	} else {
		req.flash('notice', 'Sorry, failed to add a new Inventory Item.');
		res.status(501).render('inventory/add-inventory', {
			errors: null,
			title: 'Add inventory',
			nav,
			dropDown: dropDown,
		});
	}
};

// Throws an error
invCont.throwError = async function (req, res) {
	const error = new Error(
		'Internal Server Error: Something Went Wrong! (Intentionally)'
	);
	error.status = 500;
	throw error;
};

module.exports = invCont;
