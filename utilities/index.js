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
    list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
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
    grid += `<li>
      <a href="../../inv/details/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
        <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
      </a>
      <div class="namePrice">
        <h2><a href="../../inv/details/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a></h2>
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
Util.buildInvDe
