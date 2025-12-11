const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

/* ***************************************
 * Build the inventory management view
 ****************************************/
async function buildManagement(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();

    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      classifications: classifications.rows,
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************************
 * Build Add Classification page
 ****************************************/
async function buildAddClassification(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************************
 * Add a new classification
 ****************************************/
async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name);

    if (result) {
      req.flash('notice', `New classification '${classification_name}' added.`);
      return res.redirect('/inv/');
    }

    req.flash('notice', 'Failed to add classification.');
    const nav = await utilities.getNav();
    res.status(500).render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************************
 * Build Add Inventory page
 ****************************************/
async function buildAddInventory(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();

    res.render('inventory/add-inventory', {
      title: 'Add Inventory',
      nav,
      classificationList,
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************************
 * Add a new inventory item
 ****************************************/
async function addInventory(req, res, next) {
  try {
    const invData = req.body;
    const result = await invModel.addInventory(invData);

    if (result) {
      req.flash('notice', `Inventory item '${invData.inv_make} ${invData.inv_model}' added.`);
      return res.redirect('/inv/');
    }

    req.flash('notice', 'Failed to add inventory.');
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();

    res.status(500).render('inventory/add-inventory', {
      title: 'Add Inventory',
      nav,
      classificationList,
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************************
 * Build inventory by classification
 ****************************************/
async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const nav = await utilities.getNav();
    const grid = await utilities.buildClassificationGrid(data);

    res.render('inventory/classification', {
      title: 'Inventory',
      nav,
      grid,
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************************
 * Build inventory detail page
 ****************************************/
async function buildInvDetail(req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getInventoryById(inv_id);
    const nav = await utilities.getNav();
    const details = await utilities.buildInvDetail(data);

    res.render('inventory/detail', {
      title: 'Inventory Detail',
      nav,
      details,
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************************
 * Get inventory JSON (AJAX)
 ****************************************/
async function getInventoryJSON(req, res, next) {
  try {
    const classification_id = req.params.classification_id;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/* ***************************************
 * Build Edit Inventory page
 ****************************************/
async function buildEditInv(req, res, next) {
  try {
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
  } catch (err) {
    next(err);
  }
}

/* ***************************************
 * Update inventory item
 ****************************************/
async function updateInventory(req, res, next) {
  try {
    const invData = req.body;
    const result = await invModel.updateInventory(invData);

    if (result) {
      req.flash('notice', 'Inventory item updated successfully.');
      return res.redirect('/inv/');
    }

    req.flash('notice', 'Failed to update inventory.');
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(invData.classification_id);

    res.status(500).render('inventory/edit-inventory', {
      title: 'Edit Inventory',
      nav,
      classificationList,
      invData,
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************************
 * Build Delete Inventory page
 ****************************************/
async function buildDeleteInv(req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const invData = await invModel.getInventoryById(inv_id);
    const nav = await utilities.getNav();

    res.render('inventory/delete-inventory', {
      title: 'Delete Inventory',
      nav,
      invData: invData[0],
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************************
 * Delete inventory item
 ****************************************/
async function deleteInventory(req, res, next) {
  try {
    const inv_id = req.body.inv_id;
    const result = await invModel.deleteInventory(inv_id);

    if (result) {
      req.flash('notice', 'Inventory item deleted successfully.');
      return res.redirect('/inv/');
    }

    req.flash('notice', 'Failed to delete inventory.');
    res.redirect('/inv/');
  } catch (err) {
    next(err);
  }
}

/* ***************************************
 * Trigger 500 error
 ****************************************/
function throwError(req, res, next) {
  next(new Error('Test 500 error!'));
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

