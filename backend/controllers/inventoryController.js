import inventoryModel from "../models/inventoryModel.js";

export const getAllInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find()
      .populate("medicine", "medicineName category")
      .populate("supplier", "supplierName")
      .populate("purchase", "invoiceNumber purchaseDate");

    res.status(200).json({
      status: true,
      message: "Inventory fetched successfully",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getInventoryByMedicine = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({ medicine: req.params.medicineId })
      .populate("medicine", "medicineName category")
      .populate("supplier", "supplierName");

    if (!inventory.length) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found in inventory",
      });
    }

    res.status(200).json({
      status: true,
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getLowStock = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        availableQuantity: { $lte: 10 },
        status: { $ne: "Expired" },
      })
      .populate("medicine", "medicineName")
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      message: "Low stock medicines",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getExpiredInventory = async (req, res) => {
  try {
    const today = new Date();

    const inventory = await inventoryModel
      .find({
        expiryDate: { $lt: today },
      })
      .populate("medicine", "medicineName")
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      message: "Expired medicines",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getNearExpiryInventory = async (req, res) => {
  try {
    const today = new Date();

    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const inventory = await inventoryModel
      .find({
        expiryDate: {
          $gte: today,
          $lte: next30Days,
        },
      })
      .populate("medicine", "medicineName")
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      message: "Near expiry medicines",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
