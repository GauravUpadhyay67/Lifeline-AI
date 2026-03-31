const BloodInventory = require('../models/BloodInventory');

// @desc    Get hospital inventory
// @route   GET /api/inventory
// @access  Private (Hospital only)
const getInventory = async (req, res) => {
  try {
    let inventory = await BloodInventory.findOne({ hospital: req.user._id });

    if (!inventory) {
      // Create default inventory if not exists
      inventory = await BloodInventory.create({
        hospital: req.user._id,
        stock: { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0 },
        beds: { icu: { total: 20, occupied: 0 }, general: { total: 100, occupied: 0 } }
      });
    }

    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update hospital inventory
// @route   PUT /api/inventory
// @access  Private (Hospital only)
const updateInventory = async (req, res) => {
  try {
    const { stock, beds } = req.body;

    let inventory = await BloodInventory.findOne({ hospital: req.user._id });

    if (inventory) {
      if (stock) inventory.stock = stock;
      if (beds) inventory.beds = beds;
      inventory.lastUpdated = Date.now();
      await inventory.save();
      res.json(inventory);
    } else {
      inventory = await BloodInventory.create({
        hospital: req.user._id,
        stock: stock || { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0 },
        beds: beds || { icu: { total: 20, occupied: 0 }, general: { total: 100, occupied: 0 } }
      });
      res.status(201).json(inventory);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getInventory,
  updateInventory,
};
