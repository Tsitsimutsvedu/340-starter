const express = require('express');
const router = new express.Router();

// ✅ Correct filename
const invController = require('../controllers/inventoryController');

const utilities = require('../utilities/');
const invValidate = require('../utilities/inventory-validation');

// Management page
router.get(
  '/',
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildManagement)
);

// Add classification
router.get(
  '/add-classification',
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  '/add-classification',
  utilities.checkAdminEmployee,
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
);

// Add inventory
router.get(
  '/add-inventory',
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  '/add-inventory',
  utilities.checkAdminEmployee,
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);

// Classification view
router.get(
  '/type/:classificationId',
  utilities.handleErrors(invController.buildByClassificationId)
);

// Inventory detail
router.get(
  '/details/:invId',
  utilities.handleErrors(invController.buildInvDetail)
);

// AJAX inventory JSON
router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invController.getInventoryJSON)
);

// Edit inventory
router.get(
  '/edit/:inv_id',
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildEditInv)
);

router.post(
  '/update/',
  utilities.checkAdminEmployee,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Delete inventory
router.get(
  '/delete/:inv_id',
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildDeleteInv)
);

router.post(
  '/delete/',
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.deleteInventory)
);

// Trigger 500
router.get('/trigger500', utilities.handleErrors(invController.throwError));

module.exports = router;

