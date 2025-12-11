const invModel = require('../models/inventory-model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Util = {};

/* ***************************************
 * Build navigation HTML dynamically
 **************************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications();
  let list = '<ul>';
  list += '<li><a href="/" title="Home page">Home</a></li>';

  data.rows.forEach((row) => {
    list += `
      <li>
        <a href="/inv/type/${row.classification_id}"
           title="See our inventory of ${row.classification_name} vehicles">
          ${row.classification_name}
        </a>
      </li>`;
  });

  list += '</ul>';
  return list;
};

/* ***************************************
 * Build inventory grid HTML
 **************************************** */
Util.buildClassificationGrid = async function (data) {
  if (!data || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  let grid = '<ul id="inv-display">';

  data.forEach((vehicle) => {
    grid += `
      <li>
        <a href="../../inv/details/${vehicle.inv_id}"
           title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}"
               alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>

        <div class="namePrice">
          <h2>
            <a href="../../inv/details/${vehicle.inv_id}">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>

          <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
          <hr />
        </div>
      </li>`;
  });

  grid += '</ul>';
  return grid;
};

/* ***************************************
 * Build inventory detail HTML
 **************************************** */
Util.buildInvDetail = async function (vehicle) {
  if (!vehicle) {
    return '<p class="notice">Vehicle not found.</p>';
  }

  return `
    <section id="inv-detail">

      <img src="${vehicle.inv_image}"
           alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />

      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

      <p class="price">
        Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}
      </p>

      <p><strong>Description:</strong> ${vehicle.inv_description}</p>
      <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      <p><strong>Mileage:</strong>
        ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles
      </p>

    </section>
  `;
};

/* ***************************************
 * Error handler wrapper
 **************************************** */
Util.handleErrors = function (controller) {
  return async function (req, res, next) {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

module.exports = Util;
