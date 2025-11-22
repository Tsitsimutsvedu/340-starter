const invModel = require('../models/inventory-model');
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
	let data = await invModel.getClassifications();
	let list = '<ul>';
	list += '<li><a href="/" title="Home page">Home</a></li>';
	data.rows.forEach((row) => {
		list += '<li>';
		list +=
			'<a href="/inv/type/' +
			row.classification_id +
			'" title="See our inventory of ' +
			row.classification_name +
			' vehicles">' +
			row.classification_name +
			'</a>';
		list += '</li>';
	});
	list += '</ul>';
	return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
	let grid;
	if (data.length > 0) {
		grid = '<ul id="inv-display">';
		data.forEach((vehicle) => {
			grid += '<li>';
			grid +=
				'<a href="../../inv/details/' +
				vehicle.inv_id +
				'" title="View ' +
				vehicle.inv_make +
				' ' +
				vehicle.inv_model +
				'details"><img src="' +
				vehicle.inv_thumbnail +
				'" alt="Image of ' +
				vehicle.inv_make +
				' ' +
				vehicle.inv_model +
				' on CSE Motors" /></a>';
			grid += '<div class="namePrice">';
			grid += '<h2>';
			grid +=
				'<a href="../../inv/detail/' +
				vehicle.inv_id +
				'" title="View ' +
				vehicle.inv_make +
				' ' +
				vehicle.inv_model +
				' details">' +
				vehicle.inv_make +
				' ' +
				vehicle.inv_model +
				'</a>';
			grid += '</h2>';
			grid +=
				'<span>$' +
				new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
				'</span>';
        grid += '<hr />';
			grid += '</div>';
			grid += '</li>';
		});
		grid += '</ul>';
    
	} else {
		grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
	}
	return grid;
};

/* **************************************
 * Build the details view HTML
 * ************************************ */
Util.buildInvDetail = async function (data) {
	const car = data[0];
	let details;
	if (data.length > 0) {
		// Build details view here
		details = '<div id="inv-detail-display">';
		details +=
			'<img src="' +
			car.inv_image +
			'" alt="image of ' +
			car.inv_make +
			' ' +
			car.inv_model +
			'"/>';
		let list = '<ul class="description-list">';
		list +=
			'<li id="description"><b>Description:</b> <br/>' +
			car.inv_description +
			'</li>';
		list += '<li> <b>Color:</b> ' + car.inv_color + '</li>';
		list +=
			'<li> <b>Price:</b> $' +
			parseInt(car.inv_price, 10).toLocaleString('en-US') +
			'</li>';
		list +=
			'<li> <b>Mileage:</b> ' +
			car.inv_miles.toLocaleString('en-US') +
			' Miles</li>';
		list +=
			'<li><button id="add-to-cart" title="This button doesn\'t work right now!">Add To Cart</button></li>';
		list += '</ul>';
		details += list;
		details += '</div>';
	} else {
		details += '<p class="notice">Sorry, looks like this page is empty!</p>';
	}
	return details;
};

/* **************************************
 * Build the dynamic select dropdown HTML
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications();
    let classificationList =
      '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"';
      if (
        classification_id != null &&
        Number(row.classification_id) === Number(classification_id)
      ) {
        classificationList += ' selected';
      }
      classificationList += ">" + row.classification_name + "</option>";
    });
    classificationList += "</select>";
    return classificationList;
  }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;