const utilities = require('.');
const { body, validationResult } = require('express-validator');
const validate = {};
const invModel = require('../models/inventory-model');

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
	return [
		// Classification Name is required and must be a string
		body('classification_name')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.isAlphanumeric() // No special characters
			.withMessage('Classification name does not meet the specifications.'), // on error this message is sent
	];
};

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
	return [
		// inv_make is required and must be a string
		body('inv_make')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.isAlphanumeric() // No special characters
			.withMessage('Vehicle Make does not meet the specifications.'), // on error this message is sent
		// inv_model is required and must be a string
		body('inv_model')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.isAlphanumeric() // No special characters
			.withMessage('Vehicle Model does not meet the specifications.'), // on error this message is sent
		// inv_year is required and must be a number
		body('inv_year')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 4, max: 4 })
			.isNumeric() // Only Numbers
			.withMessage('Vehicle Year does not meet the specifications.'), // on error this message is sent
		// inv_description is required and must be a string
		body('inv_description')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.withMessage('Vehicle Description does not meet the specifications.'), // on error this message is sent
		// inv_image is required and must be a string
		body('inv_image')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.withMessage('Vehicle Image does not meet the specifications.'), // on error this message is sent
		// inv_thumbnail is required and must be a string
		body('inv_thumbnail')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.withMessage('Vehicle Thumbnail does not meet the specifications.'), // on error this message is sent
		// inv_price is required and must be a currency
		body('inv_price')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.isCurrency({ allow_negatives: false })
			.withMessage('Vehicle Price does not meet the specifications.'), // on error this message is sent
		// inv_miles is required and must be a number
		body('inv_miles')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.isNumeric()
			.withMessage('Vehicle Miles do not meet the specifications.'), // on error this message is sent
		// inv_color is required and must be a string
		body('inv_color')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.withMessage('Vehicle Color does not meet the specifications.'), // on error this message is sent
	];
};

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
	const { classification_name } = req.body;
	let errors = [];
	errors = validationResult(req);
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav();
		res.render('inventory/add-classification', {
			errors,
			title: 'Add Classification',
			nav,
			classification_name,
		});
		return;
	}
	next();
};

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
	const {
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
	let errors = [];
	errors = validationResult(req);
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav();
		let dropDown = await utilities.buildClassificationList(classification_id);
		res.render('inventory/add-inventory', {
			errors,
			title: 'Add Inventory',
			nav,
			dropDown: dropDown,
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
		});
		return;
	}
	next();
};

/* ******************************
 * Check data and return errors or continue to edit inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
	const {
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
		inv_id,
	} = req.body;
	let errors = [];
	errors = validationResult(req);
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav();
		const itemData = (await invModel.getInvItemById(inv_id))[0];
		let dropDown = await utilities.buildClassificationList(
			itemData.classification_id
		);
		const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
		res.render('inventory/edit-inventory', {
			errors,
			title: 'Edit '+itemName,
			nav,
			dropDown: dropDown,
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
			inv_id,
		});
		return;
	}
	next();
};

module.exports = validate;
