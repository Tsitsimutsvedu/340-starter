const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

/* ***************************************
 * Build the inventory management view
 ****************************************/
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  const classifications = await invModel.getClassifications();

  res.render('inventory/management', {
    title: 'Inventory Management',
    nav,
    classifications: classifications.rows,
  });
}

/* ***************************************
 * Build the Add Classification page
 ****************************************/
async function buildAddClassification(req, res, next) {
  let nav = await utilities.getNav();
  res.render('inventory/add-classification', {
    title: 'Add Classification',
    nav,
  });
}

/* ***************************************
 * Add a new classification
 ****************************************/
async function addClassification(req, res) {
  const { classification_name } = req.body;
  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash('notice', `New classification '${classification_name}' added.`);
    res.redirect('/inv/');
  } else {
    req.flash('notice', 'Failed to add classification.');
    let nav = await utilities.getNav();
    res.status(500).render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
    });
  }
}

/* ***************************************
 * Build the Add Inventory page
 ****************************************/
async function buildAddInventory(req, res, next) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();

  res.render('inventory/add-inventory', {
    title: 'Add Inventory',
    nav,
    classificationList,
  });
}

/* ***************************************
 * Add a new inventory item
 ****************************************/
async function addInventory(req, res) {
  const invData = req.body;
  const result = await invModel.addInventory(invData);

  if (result) {
    req.flash('notice', `Inventory item '${invData.inv_make} ${invData.inv_model}' added.`);
    res.redirect('/inv/');
  } else {
    req.flash('notice', 'Failed to add inventory.');
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.status(500).render('inventory/add-inventory', {
      title: 'Add Inventory',
      nav,
      classificationList,
    });
  }
}

/* ***************************************
 * Build inventory by classification page
 ****************************************/
async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  let nav = await utilities.getNav();
  let grid = await utilities.buildClassificationGrid(data);

  res.render('inventory/classification', {
    title: 'Inventory',
    nav,
    grid,
  });
}

/* ***************************************
 * Build inventory details page
 ****************************************/
async function buildInvDetail(req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryById(inv_id);
  let nav = await utilities.getNav();
  const details = await utilities.buildInvDetail(data);

  res.render('inventory/detail', {
    title: 'Inventory Detail',
    nav,
    details,
  });
}

/* ***************************************
 * Get inventory JSON for AJAX requests
 ****************************************/
async function getInventoryJSON(req, res, next) {
  const classification_id = req.params.classification_id;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  return res.json(data);
}

/* ***************************************
 * Build Edit Inventory page
 ****************************************/
async function buildEditInv(req, res, next) {
  const inv_id = req.params.inv_id;
  const invData = await invModel.getInventoryById(inv_id);
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(invData[0].classification_id);

  res.render('inventory/edit-inventory', {
    title: 'Edit Inventory',
    nav,
    classificationList,
    invData: invData[0],
  });
}

/* ***************************************
 * Update inventory item
 ****************************************/
async function updateInventory(req, res) {
  const invData = req.body;
  const result = await invModel.updateInventory(invData);

  if (result) {
    req.flash('notice', `Inventory item updated successfully.`);
    res.redirect('/inv/');
  } else {
    req.flash('notice', 'Failed to update inventory.');
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(invData.classification_id);
    res.status(500).render('inventory/edit-inventory', {
      title: 'Edit Inventory',
      nav,
      classificationList,
      invData,
    });
  }
}

/* ***************************************
 * Build Delete Inventory page
 ****************************************/
async function buildDeleteInv(req, res, next) {
  const inv_id = req.params.inv_id;
  const invData = await invModel.getInventoryById(inv_id);
  const nav = await utilities.getNav();

  res.render('inventory/delete-inventory', {
    title: 'Delete Inventory',
    nav,
    invData: invData[0],
  });
}

/* ***************************************
 * Delete inventory item
 ****************************************/
async function deleteInventory(req, res) {
  const inv_id = req.body.inv_id;
  const result = await invModel.deleteInventory(inv_id);

  if (result) {
    req.flash('notice', 'Inventory item deleted successfully.');
    res.redirect('/inv/');
  } else {
    req.flash('notice', 'Failed to delete inventory.');
    res.redirect('/inv/');
  }
}

/* ***************************************
 * Trigger 500 error (for testing)
 ****************************************/
async function throwError(req, res, next) {
  throw new Error('Test 500 error!');
}

module.exports = {
  buildManagement,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory,
  buildByClassificationId,
  buildInvDetail,
  getInventoryJSON,
  buildEditInv,
  updateInventory,
  buildDeleteInv,
  deleteInventory,
  throwError,
};
