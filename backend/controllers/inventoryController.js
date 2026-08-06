import medicineModel from "../models/medicineModel.js";

export const getAllInventory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalMedicines = await medicineModel.countDocuments();
    const inventory = await medicineModel
      .find()
      .populate("supplier", "supplierName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: true,
      message: "Inventory fetched successfully",
      inventory,
      currentPage: page,
      totalPages: Math.ceil(totalMedicines / limit),
      totalMedicines,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
export const searchInventory = async (req, res) => {
  try {
    const { keyword } = req.query;

    const medicines = await medicineModel
      .find({
        medicineName: {
          $regex: keyword,
          $options: "i",
        },
      })
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      data: medicines,
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
    const medicine = await medicineModel
      .findById(req.params.id)
      .populate("supplier", "supplierName");

    if (!medicine) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      status: true,
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const increaseStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        status: false,
        message: "Enter a valid quantity",
      });
    }

    const medicine = await medicineModel.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found",
      });
    }

    medicine.stockQuantity += Number(quantity);

    await medicine.save();

    res.status(200).json({
      status: true,
      message: "Stock increased successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const adjustStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        status: false,
        message: "Enter a valid quantity",
      });
    }

    const medicine = await medicineModel.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found",
      });
    }

    if (medicine.stockQuantity < quantity) {
      return res.status(400).json({
        status: false,
        message: "Insufficient stock",
      });
    }

    medicine.stockQuantity -= Number(quantity);

    await medicine.save();

    res.status(200).json({
      status: true,
      message: "Stock adjusted successfully",
      data: medicine,
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
    const medicines = await medicineModel
      .find({
        stockQuantity: { $lte: 10 },
      })
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      message: "Low stock medicines",
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getOutOfStock = async (req, res) => {
  try {
    const medicines = await medicineModel
      .find({
        stockQuantity: 0,
      })
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      message: "Out of stock medicines",
      data: medicines,
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
    const medicines = await medicineModel
      .find({
        expiryDate: { $lt: new Date() },
      })
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      message: "Expired medicines",
      data: medicines,
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

    const medicines = await medicineModel
      .find({
        expiryDate: {
          $gte: today,
          $lte: next30Days,
        },
      })
      .populate("supplier", "supplierName");

    res.status(200).json({
      status: true,
      message: "Near expiry medicines",
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
