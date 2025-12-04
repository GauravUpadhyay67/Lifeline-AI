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
        stock: { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0 }
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
    const { stock } = req.body;

    let inventory = await BloodInventory.findOne({ hospital: req.user._id });

    if (inventory) {
      inventory.stock = stock;
      inventory.lastUpdated = Date.now();
      await inventory.save();
      res.json(inventory);
    } else {
      inventory = await BloodInventory.create({
        hospital: req.user._id,
        stock,
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
